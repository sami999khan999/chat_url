/**
 * Helpers for moving a website URL through the router.
 *
 * The chat page lives at the catch-all route `/[...url]`, so the target URL is
 * carried inside the pathname. A raw URL cannot be dropped in there as-is:
 * Next.js collapses the `//` of `https://example.com`, which turns the path
 * into `/https:/example.com` and hands the page a URL that can never be
 * crawled. Everything below keeps the URL encoded on the way in and repairs it
 * on the way out.
 */

/** Adds a protocol when the user omitted one and validates the result. */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/+/, "")}`;

  try {
    const parsed = new URL(withProtocol);

    // Reject anything that is not a real http(s) address, e.g. "javascript:"
    // sneaking through or a hostname without a dot such as "hello world".
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".")) return null;

    return parsed.toString();
  } catch {
    return null;
  }
}

/** Builds the chat route for a URL, encoded so the router cannot mangle it. */
export function buildChatPath(url: string): string {
  return `/${encodeURIComponent(url)}`;
}

/** Percent-decodes a single path segment, tolerating malformed sequences. */
function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    // A stray "%" (e.g. ".../50%off") makes decodeURIComponent throw.
    return segment;
  }
}

/**
 * Rebuilds the website URL from the catch-all segments.
 *
 * Handles both the encoded single-segment form produced by `buildChatPath` and
 * the legacy form where a pasted URL was split across segments and had its
 * protocol slashes collapsed by the router.
 */
export function reconstructUrl(segments: string[] | undefined): string {
  if (!segments?.length) return "";

  const joined = segments.map(safeDecode).join("/");

  // Repair "https:/example.com" -> "https://example.com".
  return joined.replace(/^(https?:)\/(?!\/)/i, "$1//");
}
