import { retryFetch } from "@/lib/retryFetch";

export async function findAirtableOrder({
  airtableBaseUrl,
  airtableHeaders,
  reference,
}) {
  const existingUrl = new URL(airtableBaseUrl);

  const escapedReference = reference
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  const formula = `{Payment Reference}="${escapedReference}"`;

  existingUrl.searchParams.set("filterByFormula", formula);
  existingUrl.searchParams.set("maxRecords", "10");

  console.log("Airtable lookup diagnostic:", {
    tableEndpoint: existingUrl.origin + existingUrl.pathname,
    reference,
    formula,
  });

  const response = await retryFetch(existingUrl, {
    headers: airtableHeaders,
    cache: "no-store",
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Airtable lookup error:", {
      status: response.status,
      response: responseText,
    });

    throw new Error(
      `Airtable order lookup failed with status ${response.status}.`
    );
  }

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error("Airtable returned an invalid JSON response.");
  }

  console.log("Airtable lookup result:", {
    reference,
    recordsFound: result.records?.length ?? 0,
    recordIds: result.records?.map((record) => record.id) ?? [],
  });

  return result.records?.[0] ?? null;
}
