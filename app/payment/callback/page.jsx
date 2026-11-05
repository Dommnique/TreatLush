"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./payment-callback.css";

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG so there are no extra dependencies)              */
/* ------------------------------------------------------------------ */

function SpinnerIcon() {
  return <span className="pc-spinner" aria-hidden="true" />;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="pc-icon pc-icon-check"
    >
      <path
        d="M13 25.5l8 8L35.5 15"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PackageClockIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pc-icon">
      <path
        d="M8 16.5L24 8l16 8.5v15L24 40 8 31.5v-15z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M8 16.5L24 25l16-8.5M24 25v15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle
        cx="36"
        cy="36"
        r="9"
        fill="var(--pc-tone-soft)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M36 31.5V36l3 2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="pc-icon pc-icon-hourglass"
    >
      <path
        d="M14 8h20M14 40h20"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M16 8c0 8 5 11 8 16-3 5-8 8-8 16M32 8c0 8-5 11-8 16 3 5 8 8 8 16"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 36.5c1.2-2 3-3.2 4.5-3.2s3.3 1.2 4.5 3.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="pc-icon pc-icon-alert"
    >
      <path
        d="M24 6.5L44 40.5H4L24 6.5z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 19v10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="34.5" r="2.4" fill="currentColor" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pc-icon">
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="3.5" />
      <path
        d="M18.5 19.5c.6-3.4 3-5.2 6-5.2 3.4 0 5.7 2 5.7 5 0 4.4-5.5 4.4-5.5 8.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24.4" cy="33.8" r="2.3" fill="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width="15"
      height="15"
    >
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 9V6.5A2.5 2.5 0 0012.5 4h-6A2.5 2.5 0 004 6.5v6A2.5 2.5 0 006.5 15H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-status presentation: tone (colour theme), icon, copy           */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG = {
  verifying: {
    tone: "teal",
    eyebrow: "Hang tight",
    title: "Verifying your payment",
    Icon: SpinnerIcon,
    pulse: true,
  },
  success: {
    tone: "green",
    eyebrow: "Order confirmed",
    title: "Payment successful!",
    Icon: CheckIcon,
  },
  "order-pending": {
    tone: "amber",
    eyebrow: "Action needed",
    title: "Order confirmation pending",
    Icon: PackageClockIcon,
  },
  pending: {
    tone: "blue",
    eyebrow: "Still processing",
    title: "Payment pending",
    Icon: HourglassIcon,
    pulse: true,
  },
  failed: {
    tone: "red",
    eyebrow: "Not completed",
    title: "Payment unsuccessful",
    Icon: AlertIcon,
  },
  error: {
    tone: "slate",
    eyebrow: "Verification problem",
    title: "Unable to verify payment",
    Icon: QuestionIcon,
  },
};

const NEXT_STEPS = [
  {
    title: "Order received",
    text: "Your payment is confirmed and your order is on our list.",
  },
  { title: "Freshly prepared", text: "Made in small batches, just for you." },
  { title: "On its way", text: "Delivered chilled to your address." },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function ProgressSteps({ status }) {
  const done = status === "success";
  return (
    <ol className="pc-steps" aria-label="Checkout progress">
      <li className="pc-step is-done">
        <span className="pc-step-dot">✓</span>Cart
      </li>
      <li className="pc-step-sep" aria-hidden="true" />
      <li className="pc-step is-done">
        <span className="pc-step-dot">✓</span>Checkout
      </li>
      <li className="pc-step-sep" aria-hidden="true" />
      <li className={`pc-step ${done ? "is-done" : "is-active"}`}>
        <span className="pc-step-dot">{done ? "✓" : "3"}</span>Confirmation
      </li>
    </ol>
  );
}

function ReferenceBox({ reference }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — user can still select the text */
    }
  }

  return (
    <div className="pc-ref">
      <div className="pc-ref-text">
        <span className="pc-ref-label">Transaction reference</span>
        <code className="pc-ref-value">{reference}</code>
      </div>
      <button type="button" className="pc-ref-copy" onClick={copy}>
        <CopyIcon />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Actions({ status, reference, onRetry }) {
  switch (status) {
    case "success":
      return (
        <div className="pc-actions">
          <Link href="/products" className="pc-btn pc-btn-primary">
            Continue Shopping
          </Link>
          <Link href="/" className="pc-btn pc-btn-outline">
            Back to Home
          </Link>
        </div>
      );
    case "order-pending":
      return (
        <div className="pc-actions">
          <Link href="/contact" className="pc-btn pc-btn-primary">
            Contact Support
          </Link>
          <button
            type="button"
            className="pc-btn pc-btn-outline"
            onClick={onRetry}
          >
            Check Again
          </button>
        </div>
      );
    case "pending":
      return (
        <div className="pc-actions">
          <button
            type="button"
            className="pc-btn pc-btn-primary"
            onClick={onRetry}
          >
            Check Again
          </button>
          <Link href="/" className="pc-btn pc-btn-outline">
            Back to Home
          </Link>
        </div>
      );
    case "failed":
      return (
        <div className="pc-actions">
          <Link href="/checkout" className="pc-btn pc-btn-primary">
            Try Again
          </Link>
          <Link href="/cart" className="pc-btn pc-btn-outline">
            Back to Cart
          </Link>
        </div>
      );
    case "error":
      return (
        <div className="pc-actions">
          {reference ? (
            <button
              type="button"
              className="pc-btn pc-btn-primary"
              onClick={onRetry}
            >
              Try Again
            </button>
          ) : (
            <Link href="/cart" className="pc-btn pc-btn-primary">
              Back to Cart
            </Link>
          )}
          <Link href="/contact" className="pc-btn pc-btn-outline">
            Contact Support
          </Link>
        </div>
      );
    default:
      return null; // verifying: no actions, just wait
  }
}

/* ------------------------------------------------------------------ */
/*  Main content (your verification logic, unchanged except for the    */
/*  `attempt` counter that powers the "Check Again" buttons)           */
/* ------------------------------------------------------------------ */

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "We're checking your payment with Paystack..."
  );
  const [attempt, setAttempt] = useState(0);

  function handleRetry() {
    setStatus("verifying");
    setMessage("We're checking your payment with Paystack...");
    setAttempt((n) => n + 1);
  }

  useEffect(() => {
    let cancelled = false;
    const update = (nextStatus, nextMessage) => {
      if (cancelled) return;
      setStatus(nextStatus);
      setMessage(nextMessage);
    };

    if (!reference) {
      update("error", "No transaction reference was found.");
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
            update(
              "order-pending",
              "Your payment was verified, but we couldn't confirm that your order was saved. Please contact support before attempting another payment."
            );
            return;
          }

          update("error", result.message || "We couldn't verify your payment.");
          return;
        }

        if (result.data.status === "success") {
          if (result.orderSaved === true) {
            update(
              "success",
              "Your payment has been verified and your order has been recorded successfully!"
            );
            // TODO: clear the cart here (e.g. clearCart() / localStorage.removeItem("cart"))
          } else {
            update(
              "order-pending",
              "Your payment was successful, but your order hasn't been confirmed as saved yet. Please contact support before attempting another payment."
            );
          }
        } else if (
          result.data.status === "failed" ||
          result.data.status === "abandoned"
        ) {
          update(
            "failed",
            "Your payment was not completed. Please contact us if you believe this is incorrect."
          );
        } else {
          update(
            "pending",
            "Your payment is still being processed. Please check again shortly."
          );
        }
      } catch (error) {
        console.error("Verification request failed:", error);
        update(
          "error",
          "We couldn't check your payment right now. Please contact support before attempting another payment."
        );
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [reference, attempt]);

  const { tone, eyebrow, title, Icon, pulse } = STATUS_CONFIG[status];
  const warnNoRepay =
    Boolean(reference) && (status === "order-pending" || status === "error");

  return (
    <main className="payment-callback" data-tone={tone}>
      <div className="pc-wrap">
        <ProgressSteps status={status} />

        <section className="pc-card" role="status" aria-live="polite">
          <div
            className={`pc-icon-wrap ${pulse ? "is-pulsing" : ""}`}
            key={status}
          >
            <Icon />
          </div>

          <span className="pc-eyebrow">{eyebrow}</span>
          <h1 className="pc-title">{title}</h1>
          <p className="pc-message">{message}</p>

          {warnNoRepay && (
            <div className="pc-callout">
              <strong>Please don&apos;t pay again yet.</strong> Keep your
              transaction reference handy and speak to support first so you
              aren&apos;t charged twice.
            </div>
          )}

          {status === "verifying" && (
            <p className="pc-hint">
              Please don&apos;t close this page or press back.
            </p>
          )}

          {reference && status !== "verifying" && (
            <ReferenceBox reference={reference} />
          )}

          {status === "success" && (
            <ol className="pc-timeline">
              {NEXT_STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="pc-timeline-num">{i + 1}</span>
                  <div>
                    <div className="pc-timeline-title">{s.title}</div>
                    <div className="pc-timeline-text">{s.text}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          <Actions
            status={status}
            reference={reference}
            onRetry={handleRetry}
          />

          {(status === "failed" || status === "pending") && (
            <p className="pc-support">
              Need help? <Link href="/contact">Contact us</Link>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="payment-callback" data-tone="teal">
          <div className="pc-wrap">
            <section className="pc-card" role="status" aria-live="polite">
              <div className="pc-icon-wrap is-pulsing">
                <SpinnerIcon />
              </div>
              <span className="pc-eyebrow">Hang tight</span>
              <h1 className="pc-title">Verifying your payment</h1>
              <p className="pc-message">
                We&apos;re checking your payment with Paystack...
              </p>
            </section>
          </div>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
