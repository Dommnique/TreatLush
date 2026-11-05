const AIRTABLE_API_URL = "https://api.airtable.com/v0";

const ALLOWED_SUBJECTS = [
  "General enquiry",
  "Order or delivery",
  "Payment issue",
  "Bulk or event orders",
  "Feedback",
];

const PRIORITY_MAP = {
  "General enquiry": "Low",
  Feedback: "Medium",
  "Order or delivery": "High",
  "Payment issue": "High",
  "Bulk or event orders": "High",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    // Read and validate the submitted data.
    const body = await request.json();

    const {
      fullName,
      email,
      phone = "",
      subject,
      reference = "",
      message,
    } = body;

    if (
      typeof fullName !== "string" ||
      fullName.trim().length < 2 ||
      fullName.trim().length > 150
    ) {
      return Response.json(
        { success: false, message: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !EMAIL_RE.test(email.trim())
    ) {
      return Response.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (
      typeof phone !== "string" ||
      phone.length > 40 ||
      (phone.trim() && phone.trim().replace(/\D/g, "").length < 10)
    ) {
      return Response.json(
        { success: false, message: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    if (typeof subject !== "string" || !ALLOWED_SUBJECTS.includes(subject)) {
      return Response.json(
        { success: false, message: "Please select a valid contact subject." },
        { status: 400 }
      );
    }

    if (
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > 5000
    ) {
      return Response.json(
        {
          success: false,
          message: "Your message must contain between 10 and 5000 characters.",
        },
        { status: 400 }
      );
    }

    if (typeof reference !== "string" || reference.length > 200) {
      return Response.json(
        { success: false, message: "The order reference is invalid." },
        { status: 400 }
      );
    }

    // Use the existing Airtable credentials and the separate contact table.
    const airtablePAT = process.env.AIRTABLE_PAT;
    const airtableBaseID = process.env.AIRTABLE_BASE_ID;
    const contactTableName = process.env.AIRTABLE_CONTACT_TABLE_NAME;

    if (!airtablePAT || !airtableBaseID || !contactTableName) {
      console.error("Contact API configuration is incomplete.");

      return Response.json(
        { success: false, message: "The contact service is not configured." },
        { status: 500 }
      );
    }

    // Assign priority on the server using the validated subject.
    const priority = PRIORITY_MAP[subject];

    const fields = {
      "Customer Name": fullName.trim(),
      Email: email.trim(),
      "Phone Number": phone.trim(),
      Type: subject,
      "Order Reference": reference.trim(),
      Description: message.trim(),
      Status: "New",
      Priority: priority,
      "Date Received": new Date().toISOString().split("T")[0],
    };

    // Send the record to the Customer Feedback table.
    const airtableURL =
      `${AIRTABLE_API_URL}/` +
      `${encodeURIComponent(airtableBaseID)}/` +
      `${encodeURIComponent(contactTableName)}`;

    const airtableResponse = await fetch(airtableURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtablePAT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });

    if (!airtableResponse.ok) {
      const airtableError = await airtableResponse.text();

      // Log server-side only; do not expose Airtable details to customers.
      console.error(
        "Airtable contact submission failed:",
        airtableResponse.status,
        airtableError
      );

      return Response.json(
        {
          success: false,
          message: "We couldn't save your message. Please try again.",
        },
        { status: 502 }
      );
    }

    const createdRecord = await airtableResponse.json();

    return Response.json(
      {
        success: true,
        message: "Your message has been received.",
        recordId: createdRecord.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    const isTimeout = error?.name === "TimeoutError";

    return Response.json(
      {
        success: false,
        message: isTimeout
          ? "The request took too long. Please check whether your message was received before trying again."
          : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
