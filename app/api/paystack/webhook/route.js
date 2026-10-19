import crypto from "node:crypto";

export async function POST(request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    console.error("Paystack secret key is not configured.");
    return Response.json(
      { received: false, message: "Webhook is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return Response.json(
      { received: false, message: "Missing signature." },
      { status: 401 }
    );
  }

  // Read the original body before parsing it.
  const rawBody = await request.text();

  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  const supplied = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return Response.json(
      { received: false, message: "Invalid signature." },
      { status: 401 }
    );
  }

  let event;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json(
      { received: false, message: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  // Ignore event types this endpoint does not handle.
  if (event.event !== "charge.success") {
    return Response.json({ received: true });
  }


  return Response.json(
    {
      received: false,
      message: "Successful payment processing is not connected yet.",
    },
    { status: 503 }
  );
}
