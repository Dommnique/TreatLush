import { supabase } from "@/lib/supabase";

export async function markPaymentRecoverySaved(reference) {
  if (!reference || typeof reference !== "string") {
    throw new Error("A valid payment reference is required.");
  }

  const { data, error } = await supabase
    .from("payment_recovery")
    .update({
      recovery_status: "saved",
      recovered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_error: null,
    })
    .eq("payment_reference", reference)
    .select("id, payment_reference, recovery_status")
    .maybeSingle();

  if (error) {
    console.error("Failed to update recovery status:", error);
    throw new Error("Unable to update payment recovery status.");
  }

  if (!data) {
    throw new Error("No recovery record was found for this payment reference.");
  }

  return data;
}
