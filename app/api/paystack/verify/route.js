import {
  acquirePaymentLock,
  releasePaymentLock,
  startPaymentLockHeartbeat,
} from "@/lib/paymentLock";
import { findAirtableOrder } from "@/lib/findAirtableOrder";
import { savePaymentRecovery } from "@/lib/savePaymentRecovery";
import { markPaymentRecoverySaved } from "@/lib/markPaymentRecoverySaved";

function jsonResponse(body, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const reference = body.reference;

    if (!reference || typeof reference !== "string") {
      return jsonResponse(
        {
          status: false,
          message: "Transaction reference is required.",
        },
        400
      );
    }

    const paystackKey = process.env.PAYSTACK_SECRET_KEY;
    const airtableToken = process.env.AIRTABLE_PAT;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!paystackKey) {
      return jsonResponse(
        {
          status: false,
          message: "Payment service is not configured.",
        },
        500
      );
    }

    if (!airtableToken || !baseId || !tableName) {
      return jsonResponse(
        {
          status: false,
          message: "Order storage is not configured.",
        },
        500
      );
    }

    // 1. Verify the transaction directly with Paystack.
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          Authorization: `Bearer ${paystackKey}`,
        },
        cache: "no-store",
      }
    );

    const verification = await paystackResponse.json();

    if (!paystackResponse.ok || !verification.status || !verification.data) {
      return jsonResponse(
        {
          status: false,
          message: verification.message || "Unable to verify payment.",
        },
        502
      );
    }

    const transaction = verification.data;

    // Do not create an order for an unsuccessful or pending payment.
    if (transaction.status !== "success") {
      return jsonResponse({
        status: true,
        data: transaction,
        orderSaved: false,
        message: "Payment has not been confirmed as successful.",
      });
    }

    // 2. Validate the verified transaction and order metadata.
    const metadata = transaction.metadata;
    const customer = metadata?.customer;
    const products = metadata?.products;
    const expectedTotal = metadata?.expectedTotal;
    const subtotal = metadata?.subtotal;
    const deliveryPrice = metadata?.deliveryPrice;

    if (
      transaction.reference !== reference ||
      transaction.currency !== "NGN" ||
      !Number.isSafeInteger(transaction.amount) ||
      !Number.isSafeInteger(expectedTotal) ||
      expectedTotal <= 0 ||
      transaction.amount !== expectedTotal * 100 ||
      !Number.isSafeInteger(subtotal) ||
      !Number.isSafeInteger(deliveryPrice) ||
      subtotal < 0 ||
      deliveryPrice < 0 ||
      subtotal + deliveryPrice !== expectedTotal ||
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
      return jsonResponse(
        {
          status: false,
          message: "Payment or order details could not be validated.",
        },
        400
      );
    }

    // Validate each product entry before writing to Airtable.
    // Validate each product entry before writing to Airtable.
  
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
    return jsonResponse(
      {
        status: false,
        message: "Invalid order item details.",
      },
      400
    );
  }

  calculatedSubtotal += product.price * product.quantity;

  if (!Number.isSafeInteger(calculatedSubtotal)) {
    return jsonResponse(
      {
        status: false,
        message: "Order subtotal is invalid.",
      },
      400
    );
  }
}

if (calculatedSubtotal !== subtotal) {
  return jsonResponse(
    {
      status: false,
      message: "Product totals do not match the order subtotal.",
    },
    400
  );
}


    const orderItems = products
      .map(
        (product) =>
          `${product.title} x ${product.quantity} — ₦${(
            product.price * product.quantity
          ).toLocaleString("en-NG")}`
      )
      .join("\n");

    const deliveryAddress = [customer.address, customer.city, customer.state]
      .filter(Boolean)
      .join(", ");

    // Save verified order details to Supabase before contacting Airtable.
    const recoveryOrderData = {
      reference,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        deliveryNote: customer.deliveryNote || "",
      },
      products,
      subtotal,
      deliveryPrice,
      expectedTotal,
      currency: transaction.currency,
      transactionAmount: transaction.amount,
      airtableFields: {
        "Order ID": reference,
        "Customer Name": customer.fullName,
        Email: customer.email,
        "Phone Number": customer.phone,
        "Delivery Address": deliveryAddress,
        "Delivery Notes": customer.deliveryNote || "",
        "Items Ordered": orderItems,
        Subtotal: subtotal,
        "Delivery Fee": deliveryPrice,
        "Total Amount": expectedTotal,
        "Payment Reference": reference,
        "Payment Status": "Paid",
      },
    };

    try {
      const recovery = await savePaymentRecovery(reference, recoveryOrderData);

      console.log(
        recovery.alreadyExists
          ? "Existing payment recovery record confirmed."
          : "Payment recovery record saved."
      );
    } catch (error) {
      console.error("Payment recovery storage failed:", error);

      return jsonResponse(
        {
          status: false,
          paymentVerified: true,
          orderSaved: false,
          recoverySaved: false,
          message:
            "Payment was verified, but order protection could not be confirmed. Please contact support before retrying payment.",
        },
        503
      );
    }

    // Acquire the lock before checking or creating the Airtable order.
    let paymentLock;

    try {
      paymentLock = await acquirePaymentLock(reference);
    } catch (error) {
      console.error("Payment lock acquisition failed:", error);

      return jsonResponse(
        {
          status: false,
          paymentVerified: true,
          orderSaved: false,
          message:
            "Payment was verified, but order processing is temporarily unavailable. Please contact support if your order is not confirmed.",
        },
        503
      );
    }

    if (!paymentLock) {
      return jsonResponse(
        {
          status: false,
          paymentVerified: true,
          orderSaved: false,
          message:
            "This payment is already being processed. Please check your order status shortly.",
        },
        409
      );
    }

    const paymentHeartbeat = startPaymentLockHeartbeat(paymentLock);

    try {
      // 3. Prepare the Airtable URL and check for an existing order.
      const airtableBaseUrl =
        `https://api.airtable.com/v0/${baseId}/` +
        encodeURIComponent(tableName);

      const existingUrl = new URL(airtableBaseUrl);

      const escapedReference = reference
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');

      existingUrl.searchParams.set(
        "filterByFormula",
        `{Payment Reference}="${escapedReference}"`
      );
      existingUrl.searchParams.set("maxRecords", "1");

      const airtableHeaders = {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      };

      let existingOrder;

      try {
        existingOrder = await findAirtableOrder({
          airtableBaseUrl,
          airtableHeaders,
          reference,
        });
      } catch (error) {
        console.error("Airtable lookup failed:", error);

        return jsonResponse(
          {
            status: false,
            paymentVerified: true,
            orderSaved: false,
            message:
              "Payment was verified, but we could not check whether the order already exists. Please contact support before retrying payment.",
          },
          502
        );
      }

      if (existingOrder) {
        try {
          await markPaymentRecoverySaved(reference);
        } catch (error) {
          console.error(
            "Order exists in Airtable, but recovery status update failed:",
            error
          );
        }

        return jsonResponse({
          status: true,
          data: transaction,
          orderSaved: true,
          duplicate: true,
          orderId: existingOrder.id,
          message: "Payment verified and order already recorded.",
        });
      }

      // 4. Prepare the Airtable order record.
      const airtableRecord = {
        fields: {
          "Order ID": reference,
          "Customer Name": customer.fullName,
          Email: customer.email,
          "Phone Number": customer.phone,
          "Delivery Address": deliveryAddress,
          "Delivery Notes": customer.deliveryNote || "",
          "Items Ordered": orderItems,
          Subtotal: subtotal,
          "Delivery Fee": deliveryPrice,
          "Total Amount": expectedTotal,
          "Payment Reference": reference,
          "Payment Status": "Paid",
        },
      };

      await paymentHeartbeat.assertOwned();

      // 5. Attempt to create the Airtable order.
      let createResponse;
      let createdData = {};

      try {
        createResponse = await fetch(airtableBaseUrl, {
          method: "POST",
          headers: airtableHeaders,
          body: JSON.stringify(airtableRecord),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        });

        const responseText = await createResponse.text();

        try {
          createdData = responseText ? JSON.parse(responseText) : {};
        } catch {
          createdData = {};
        }
      } catch (error) {
        // Airtable may have created the record even if the response
        // did not reach our application.
        console.error("Airtable creation request error:", error);
      }

      // 6. If creation failed or its outcome is uncertain,
      // check Airtable again before deciding what happened.
      if (!createResponse?.ok) {
        try {
          const recoveredRecord = await findAirtableOrder({
            airtableBaseUrl,
            airtableHeaders,
            reference,
          });

          if (recoveredRecord) {
            try {
              await markPaymentRecoverySaved(reference);
            } catch (error) {
              console.error("Recovery status update failed:", error);
            }
            return jsonResponse({
              status: true,
              data: transaction,
              orderSaved: true,
              duplicate: true,
              orderId: recoveredRecord.id,
              message:
                "Payment verified and existing order recovered successfully.",
            });
          }
        } catch (error) {
          console.error("Airtable recovery check error:", error);
        }

        return jsonResponse(
          {
            status: false,
            paymentVerified: true,
            orderSaved: false,
            message:
              "Payment was verified, but we could not confirm that the order was saved. Please contact support before retrying payment.",
          },
          502
        );
      }

      // 7. Confirm Airtable returned a record ID.

      if (!createdData.id) {
        console.error("Airtable response did not include a record ID.");

        try {
          const recoveredRecord = await findAirtableOrder({
            airtableBaseUrl,
            airtableHeaders,
            reference,
          });

          if (recoveredRecord) {
            try {
              await markPaymentRecoverySaved(reference);
            } catch (error) {
              console.error("Recovery status update failed:", error);
            }
            return jsonResponse({
              status: true,
              data: transaction,
              orderSaved: true,
              duplicate: true,
              orderId: recoveredRecord.id,
              message:
                "Payment verified and existing order recovered successfully.",
            });
          }
        } catch (error) {
          console.error("Airtable order confirmation failed:", error);
        }

        return jsonResponse(
          {
            status: false,
            paymentVerified: true,
            orderSaved: false,
            message:
              "Payment was verified, but the order could not be confirmed. Please contact support before retrying payment.",
          },
          502
        );
      }

      try {
        await markPaymentRecoverySaved(reference);
      } catch (error) {
        console.error("Recovery status update failed:", error);
      }

      return jsonResponse({
        status: true,
        data: transaction,
        orderSaved: true,
        duplicate: false,
        orderId: createdData.id,
        message: "Payment verified and order saved successfully.",
      });
    } finally {
      try {
        await paymentHeartbeat.stop();
      } catch (error) {
        console.error("Payment lock heartbeat cleanup failed:", error);
      }

      try {
        await releasePaymentLock(paymentLock);
      } catch (error) {
        console.error("Payment lock release failed:", error);
      }
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    return jsonResponse(
      {
        status: false,
        message: "Unable to verify payment or save the order right now.",
      },
      500
    );
  }
}
