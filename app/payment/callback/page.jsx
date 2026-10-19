"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "We're checking your payment with Paystack..."
  );

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No transaction reference was found.");
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference }),
        });

        const result = await response.json();

        if (!response.ok || !result.status || !result.data) {
          if (result.paymentVerified && result.orderSaved === false) {
            setStatus("order-pending");
            setMessage(
              "Your payment was verified, but we couldn't confirm that your order was saved. Please contact support before attempting another payment."
            );
            return;
          }

          setStatus("error");
          setMessage(result.message || "We couldn't verify your payment.");
          return;
        }

        if (result.data.status === "success") {
          if (result.orderSaved === true) {
            setStatus("success");
            setMessage(
              "Your payment has been verified and your order has been recorded successfully!"
            );
          } else {
            setStatus("order-pending");
            setMessage(
              "Your payment was successful, but your order hasn't been confirmed as saved yet. Please contact support before attempting another payment."
            );
          }
        } else if (
          result.data.status === "failed" ||
          result.data.status === "abandoned"
        ) {
          setStatus("failed");
          setMessage(
            "Your payment was not completed. Please contact us if you believe this is incorrect."
          );
        } else {
          setStatus("pending");
          setMessage(
            "Your payment is still being processed. Please check again shortly."
          );
        }
      } catch (error) {
        console.error("Verification request failed:", error);
        setStatus("error");
        setMessage(
          "We couldn't check your payment right now. Please contact support before attempting another payment."
        );
      }
    }

    verifyPayment();
  }, [reference]);

  return (
    <main className="payment-callback">
      <h1>
        {status === "verifying"
          ? "Verifying your payment"
          : status === "success"
          ? "Payment successful!"
          : status === "order-pending"
          ? "Order confirmation pending"
          : status === "pending"
          ? "Payment pending"
          : status === "failed"
          ? "Payment unsuccessful"
          : "Unable to verify payment"}
      </h1>

      <p>{message}</p>

      {reference && (
        <p>
          <strong>Transaction reference:</strong> {reference}
        </p>
      )}
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="payment-callback">
          <h1>Verifying your payment</h1>
          <p>We're checking your payment with Paystack...</p>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
