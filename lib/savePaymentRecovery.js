import { supabase } from "@/lib/supabase";

export async function savePaymentRecovery(reference, orderData) {
  if (!reference || !orderData) {
    throw new Error("Payment reference and order data are required.");
  }

  const { data, error } = await supabase
    .from("payment_recovery")
    .insert({
      payment_reference: reference,
      order_data: orderData,
      payment_status: "verified",
      recovery_status: "pending",
    })
    .select("id, payment_reference, recovery_status")
    .single();

  if (!error) {
    return {
      saved: true,
      alreadyExists: false,
      record: data,
    };
  }

  // A repeated payment event may use the same reference.
  if (error.code === "23505") {
    const { data: existing, error: lookupError } = await supabase
      .from("payment_recovery")
      .select("id, payment_reference, recovery_status")
      .eq("payment_reference", reference)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existing) {
      return {
        saved: true,
        alreadyExists: true,
        record: existing,
      };
    }
  }

  console.error("Failed to save payment recovery record:", error);

  throw new Error("Unable to save payment recovery record.");
}
