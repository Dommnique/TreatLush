export async function retryFetch(
  url,
  options = {},
  { maxAttempts = 3, delayMs = 500 } = {}
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, options);

      // Return successful responses and permanent client errors.
      // Retry rate limits and server-side failures.
      const shouldRetry = response.status === 429 || response.status >= 500;

      if (!shouldRetry || attempt === maxAttempts) {
        return response;
      }

      // Consume the response body before retrying.
      await response.arrayBuffer();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
    }

    const backoff = delayMs * 2 ** (attempt - 1);
    const jitter = Math.floor(Math.random() * 200);

    await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
  }
}
