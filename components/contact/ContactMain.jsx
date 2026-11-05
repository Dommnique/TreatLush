"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import "../../app/contact-us/contact.css";


/* ------------------------------------------------------------------ */
/*  EDIT ME — replace every placeholder below with TreatLush's real    */
/*  details. Nothing else in this file needs to change.                */
/* ------------------------------------------------------------------ */

const CONTACT = {
  phone: "+234 814 257 0688",
  phoneHref: "tel:+2348142570688",
  whatsappHref: "https://wa.me/message/HROW7XXXSUXHP1",
  email: "treatlush@gmail.com",
  address: ["Warri, Delta State"],
  hours: [{ days: "Monday – Sunday", time: "9:00am – 6:00pm" }],
  socials: [
    { label: "WhatsApp", href: "https://wa.me/message/HROW7XXXSUXHP1" },
    {
      label: "Instagram",
      href: "https://www.instagram.com/treat_lush?rpxt=dzVvMHRzYjVzNHhr&utm_source=qr",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@treat_lush?_r=1&_t=ZS-9AiOllJmkFT",
    },
  ],
  responseTime: "within 24 hours",
};

const SUBJECTS = [
  "General enquiry",
  "Order or delivery",
  "Payment issue",
  "Bulk or event orders",
  "Feedback",
];

const FAQS = [
  {
    q: "How fresh is the yogurt?",
    a: "Everything is made in small batches. Keep it refrigerated and enjoy it within a few days of delivery for the best taste.",
  },
  {
    q: "Something is wrong with my order. What should I do?",
    a: "Send us a message here with your order or transaction reference and a short description. We'll sort it out quickly.",
  },
  {
    q: "I was charged but didn't see a confirmation.",
    a: "Please don't pay again. Contact us with your transaction reference and we'll confirm your order.",
  },
  {
    q: "Do you take bulk or event orders?",
    a: "Yes. Choose “Bulk or event orders” in the form and tell us the date, quantity and location.",
  },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  width: 22,
  height: 22,
};

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </svg>
);
const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3.5 7.5l8.5 6 8.5-6" />
  </svg>
);
const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
    width="48"
    height="48"
    className="ct-check"
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

/* ------------------------------------------------------------------ */
/*  Form                                                               */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  // Lets the payment callback page link here with ?reference=...
  // e.g. <Link href={`/contact?reference=${reference}`}>Contact Support</Link>
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("reference") || "";

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: refFromUrl ? "Payment issue" : SUBJECTS[0],
    reference: refFromUrl,
    message: "",
    company: "", // honeypot: real people never fill this in
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (values.fullName.trim().length < 2)
      next.fullName = "Please enter your name.";
    if (!EMAIL_RE.test(values.email))
      next.email = "Please enter a valid email address.";
    if (values.phone && values.phone.replace(/\D/g, "").length < 10)
      next.phone = "Please enter a valid phone number or leave it blank.";
    if (values.message.trim().length < 10)
      next.message = "Please write a little more (at least 10 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    // Honeypot filled: pretend it worked, send nothing.
    if (values.company) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          subject: values.subject,
          reference: values.reference.trim(),
          message: values.message.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Request failed");
      }

      setStatus("sent");
    } catch (err) {
      console.error("Contact form failed:", err);
      setStatus("error");
    }
  }

  function reset() {
    setValues((v) => ({
      ...v,
      subject: SUBJECTS[0],
      reference: "",
      message: "",
    }));
    setErrors({});
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="ct-card ct-sent" role="status" aria-live="polite">
        <div className="ct-sent-icon">
          <CheckIcon />
        </div>
        <h2 className="ct-display">Message sent</h2>
        <p>
          Thanks, {values.fullName.trim().split(" ")[0] || "friend"}. We&apos;ll
          reply to <strong>{values.email}</strong> {CONTACT.responseTime}.
        </p>
        <button type="button" className="ct-btn ct-btn-outline" onClick={reset}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <form className="ct-card" onSubmit={handleSubmit} noValidate>
        <h2 className="ct-card-title">Send us a message</h2>
        <p className="ct-card-sub">We usually reply {CONTACT.responseTime}.</p>

        <div className="ct-grid">
          <Field label="Full name" error={errors.fullName} full>
            <input
              type="text"
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="e.g. Ada Okafor"
              autoComplete="name"
            />
          </Field>

          <Field label="Email address" error={errors.email}>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <Field
            label={
              <>
                Phone <span className="ct-opt">(optional)</span>
              </>
            }
            error={errors.phone}
          >
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="080X XXX XXXX"
              autoComplete="tel"
            />
          </Field>

          <Field label="What is this about?">
            <select
              value={values.subject}
              onChange={(e) => setField("subject", e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field
            label={
              <>
                Order reference <span className="ct-opt">(optional)</span>
              </>
            }
          >
            <input
              type="text"
              value={values.reference}
              onChange={(e) => setField("reference", e.target.value)}
              placeholder="e.g. TL_1769437281234"
            />
          </Field>

          <Field label="Your message" error={errors.message} full>
            <textarea
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder="Tell us how we can help..."
              rows={5}
            />
          </Field>

          {/* Honeypot (hidden from people and screen readers) */}
          <div className="ct-hp" aria-hidden="true">
            <label>
              Company
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={(e) => setField("company", e.target.value)}
              />
            </label>
          </div>
        </div>

        {status === "error" && (
          <div className="ct-error-banner" role="alert">
            Something went wrong sending your message. Please try again, or
            reach us on{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            .
          </div>
        )}

        <button
          type="submit"
          className="ct-btn ct-btn-primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
}

function Field({ label, error, full, children }) {
  return (
    <div
      className={`ct-field ${full ? "is-full" : ""} ${
        error ? "has-error" : ""
      }`}
    >
      <label>
        <span className="ct-label">{label}</span>
        {children}
      </label>
      {error && <span className="ct-err">{error}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="ct-hero">
        <div className="ct-hero-inner">
          <span className="ct-eyebrow">Get in touch</span>
          <h1 className="ct-display">Contact Us</h1>
          <p>
            Questions, feedback or a big order to plan? Send us a message and a
            real person will get back to you.
          </p>
        </div>
      </header>

      <section className="ct-layout">
        <Suspense
          fallback={<div className="ct-card ct-skeleton" aria-busy="true" />}
        >
          <ContactForm />
        </Suspense>

        <aside className="ct-side">
          <div className="ct-info-card">
            <InfoRow icon={<PhoneIcon />} title="Call or WhatsApp">
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </InfoRow>
            <InfoRow icon={<MailIcon />} title="Email">
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </InfoRow>
            <InfoRow icon={<PinIcon />} title="Find us">
              {CONTACT.address.map((line) => (
                <span key={line} className="ct-line">
                  {line}
                </span>
              ))}
            </InfoRow>
          </div>

          <div className="ct-info-card">
            <InfoRow icon={<ClockIcon />} title="Opening hours">
              <dl className="ct-hours">
                {CONTACT.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </InfoRow>
          </div>

          <div className="ct-social">
            <span className="ct-social-label">Follow along</span>
            <div className="ct-social-links">
              {CONTACT.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="ct-faq" aria-labelledby="faq-title">
        <h2 id="faq-title" className="ct-display">
          Quick answers
        </h2>
        <div className="ct-faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="ct-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function InfoRow({ icon, title, children }) {
  return (
    <div className="ct-info-row">
      <span className="ct-info-icon">{icon}</span>
      <div className="ct-info-body">
        <span className="ct-info-title">{title}</span>
        <div className="ct-info-text">{children}</div>
      </div>
    </div>
  );
}
