import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";

const LEASE_SECONDS = 300;
const RENEW_INTERVAL_MS = 60_000;

export async function acquirePaymentLock(reference) {
  if (typeof reference !== "string" || !reference.trim()) {
    throw new Error("A valid payment reference is required.");
  }

  const token = randomUUID();

  const { data, error } = await supabase.rpc("try_acquire_payment_lock", {
    p_reference: reference,
    p_lock_token: token,
    p_lease_seconds: LEASE_SECONDS,
  });

  if (error) {
    console.error("Payment lock acquisition failed:", error);
    throw new Error("Unable to acquire payment lock.");
  }

  return data === true ? { reference, token } : null;
}

export async function renewPaymentLock(lock) {
  const { data, error } = await supabase.rpc("renew_payment_lock", {
    p_reference: lock.reference,
    p_lock_token: lock.token,
    p_lease_seconds: LEASE_SECONDS,
  });

  if (error) {
    console.error("Payment lock renewal failed:", error);
    throw new Error("Unable to renew payment lock.");
  }

  if (data !== true) {
    throw new Error("Payment lock expired or ownership was lost.");
  }
}

export function startPaymentLockHeartbeat(lock) {
  let stopped = false;
  let lost = false;
  let renewal = Promise.resolve();

  const timer = setInterval(() => {
    if (stopped || lost) return;

    renewal = renewal
      .then(() => {
        if (!stopped && !lost) {
          return renewPaymentLock(lock);
        }
      })
      .catch((error) => {
        lost = true;
        console.error("Payment lock heartbeat failed:", error);
      });
  }, RENEW_INTERVAL_MS);

  timer.unref?.();

  return {
    async assertOwned() {
      await renewal;

      if (stopped || lost) {
        throw new Error("Payment lock ownership is no longer confirmed.");
      }

      await renewPaymentLock(lock);
    },

    async stop() {
      stopped = true;
      clearInterval(timer);
      await renewal;
    },
  };
}

export async function releasePaymentLock(lock) {
  const { data, error } = await supabase.rpc("release_payment_lock", {
    p_reference: lock.reference,
    p_lock_token: lock.token,
  });

  if (error) {
    console.error("Payment lock release failed:", error);
    throw new Error("Unable to release payment lock.");
  }

  if (data !== true) {
    throw new Error("Payment lock ownership could not be confirmed.");
  }
}
