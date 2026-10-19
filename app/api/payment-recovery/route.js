import { supabase } from "@/lib/supabase";
import { findAirtableOrder } from "@/lib/findAirtableOrder";
import {
  acquirePaymentLock,
  releasePaymentLock,
  startPaymentLockHeartbeat,
} from "@/lib/paymentLock";

function jsonResponse(body, status = 200) {
  return Response.json(body, { status });
}

function validateRecoveryRecord(record) {
  const reference = record?.payment_reference;
  const orderData = record?.order_data;
  const fields = orderData?.airtableFields;
  const customer = orderData?.customer;
  const products = orderData?.products;

  if (
    typeof reference !== "string" ||
    !reference ||
    orderData?.reference !== reference ||
    fields?.["Payment Reference"] !== reference ||
    !customer ||
    typeof customer.fullName !== "string" ||
    typeof customer.email !== "string" ||
    typeof customer.phone !== "string" ||
    typeof customer.address !== "string" ||
    typeof customer.city !== "string" ||
    typeof customer.state !== "string" ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    throw new Error("Recovery record has invalid order data.");
  }

  const { subtotal, deliveryPrice, expectedTotal } = orderData;

  if (
    !Number.isSafeInteger(subtotal) ||
    !Number.isSafeInteger(deliveryPrice) ||
    !Number.isSafeInteger(expectedTotal) ||
    subtotal < 0 ||
    deliveryPrice < 0 ||
    expectedTotal <= 0 ||
    subtotal + deliveryPrice !== expectedTotal ||
    fields.Subtotal !== subtotal ||
    fields["Delivery Fee"] !== deliveryPrice ||
    fields["Total Amount"] !== expectedTotal ||
    fields["Payment Status"] !== "Paid"
  ) {
    throw new Error("Recovery order totals are invalid.");
  }

  let calculatedSubtotal = 0;

  for (const product of products) {
    if (
      !product ||
      typeof product.title !== "string" ||
      !product.title.trim() ||
      !Number.isSafeInteger(product.price) ||
      product.price < 0 ||
      !Number.isSafeInteger(product.quantity) ||
      product.quantity < 1 ||
      !Number.isSafeInteger(product.price * product.quantity)
    ) {
      throw new Error("Recovery record contains an invalid product.");
    }

    calculatedSubtotal += product.price * product.quantity;

    if (!Number.isSafeInteger(calculatedSubtotal)) {
      throw new Error("Recovery product subtotal is invalid.");
    }
  }

  if (calculatedSubtotal !== subtotal) {
    throw new Error("Recovery product totals do not match the subtotal.");
  }

  return { reference, fields };
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return jsonResponse(
      { success: false, message: "Recovery worker is not configured." },
      500
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return jsonResponse({ success: false, message: "Unauthorized." }, 401);
  }

  const airtableToken = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!airtableToken || !baseId || !tableName) {
    return jsonResponse(
      { success: false, message: "Airtable is not configured." },
      500
    );
  }

  const airtableBaseUrl =
    `https://api.airtable.com/v0/${baseId}/` + encodeURIComponent(tableName);

  const airtableHeaders = {
    Authorization: `Bearer ${airtableToken}`,
    "Content-Type": "application/json",
  };

  const { data: records, error: claimError } = await supabase.rpc(
    "claim_payment_recovery",
    { batch_size: 5 }
  );

  if (claimError) {
    console.error("Failed to claim recovery records:", claimError);
    return jsonResponse(
      { success: false, message: "Unable to claim recovery records." },
      500
    );
  }

  const results = [];

  async function updateRecovery(record, updates) {
    const { data, error } = await supabase
      .from("payment_recovery")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id)
      .eq("recovery_status", "processing")
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(
        `Recovery record ${record.id} was not updated because it is no longer processing.`
      );
    }
  }

  async function markFailed(record, error) {
    try {
      await updateRecovery(record, {
        recovery_status: "failed",
        last_error: String(error?.message || error).slice(0, 1000),
      });
    } catch (updateError) {
      console.error(
        `Could not mark recovery record ${record.id} as failed:`,
        updateError
      );
    }
  }

  async function markSaved(record) {
    await updateRecovery(record, {
      recovery_status: "saved",
      recovered_at: new Date().toISOString(),
      last_error: null,
    });
  }

  async function deferRecord(record) {
    // The claim function incremented attempt_count. Restore it when
    // another request owns the payment lock.
    const { data, error } = await supabase
      .from("payment_recovery")
      .update({
        recovery_status: "pending",
        attempt_count: Math.max(0, record.attempt_count - 1),
        updated_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", record.id)
      .eq("recovery_status", "processing")
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(`Could not defer recovery record ${record.id}.`);
    }
  }

  for (const record of records ?? []) {
    const reference = record.payment_reference;
    let lock = null;
    let heartbeat = null;
    let deferred = false;

    try {
      const validated = validateRecoveryRecord(record);
      const fields = validated.fields;

      lock = await acquirePaymentLock(reference);

      if (!lock) {
        await deferRecord(record);
        deferred = true;
        results.push({
          reference,
          status: "skipped",
          reason: "lock_busy",
        });
        continue;
      }

      heartbeat = startPaymentLockHeartbeat(lock);

      // Always check Airtable before attempting creation.
      const existingOrder = await findAirtableOrder({
        airtableBaseUrl,
        airtableHeaders,
        reference,
      });

      if (existingOrder) {
        await markSaved(record);
        results.push({
          reference,
          status: "saved",
          action: "existing_order_found",
          airtableRecordId: existingOrder.id,
        });
        continue;
      }

      // Do not start a new write if this process no longer owns the lock.
      await heartbeat.assertOwned();

      let response;
      let createdData = {};

      try {
        response = await fetch(airtableBaseUrl, {
          method: "POST",
          headers: airtableHeaders,
          body: JSON.stringify({ fields }),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        });

        const responseText = await response.text();

        try {
          createdData = responseText ? JSON.parse(responseText) : {};
        } catch {
          createdData = {};
        }
      } catch (error) {
        // The request may have reached Airtable even if our response
        // timed out. Reconcile before allowing another creation attempt.
        console.error("Airtable creation outcome is uncertain:", error);
      }

      if (response?.ok && createdData.id) {
        await markSaved(record);
        results.push({
          reference,
          status: "saved",
          action: "order_created",
          airtableRecordId: createdData.id,
        });
        continue;
      }

      // Check for an order after any failed or ambiguous response.
      // If this lookup fails too, the catch below leaves the record
      // eligible for retry instead of assuming the order is absent.
      const recoveredOrder = await findAirtableOrder({
        airtableBaseUrl,
        airtableHeaders,
        reference,
      });

      if (recoveredOrder) {
        await markSaved(record);
        results.push({
          reference,
          status: "saved",
          action: "existing_order_reconciled",
          airtableRecordId: recoveredOrder.id,
        });
        continue;
      }

      throw new Error(
        `Airtable did not confirm order creation (HTTP ${
          response?.status ?? "unknown"
        }).`
      );
    } catch (error) {
      console.error(`Recovery failed for record ${record.id}:`, error);

      if (!deferred) {
        await markFailed(record, error);
      }

      results.push({
        reference,
        status: deferred ? "skipped" : "failed",
        reason: deferred ? "defer_failed" : "recovery_error",
      });
    } finally {
      if (heartbeat) {
        try {
          await heartbeat.stop();
        } catch (error) {
          console.error("Could not stop payment lock heartbeat:", error);
        }
      }

      if (lock) {
        try {
          await releasePaymentLock(lock);
        } catch (error) {
          console.error("Could not release recovery payment lock:", error);
        }
      }
    }
  }

  const saved = results.filter((item) => item.status === "saved").length;
  const failed = results.filter((item) => item.status === "failed").length;
  const skipped = results.filter((item) => item.status === "skipped").length;

  return jsonResponse(
    {
      success: failed === 0,
      claimed: records?.length ?? 0,
      saved,
      failed,
      skipped,
      results,
    },
    failed > 0 ? 207 : 200
  );
}
