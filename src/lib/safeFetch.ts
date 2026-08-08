/**
 * Ultra-robust response parsing utilities that prevent 
 * "SyntaxError: Unexpected token 'T', 'The page c'... is not valid JSON" 
 * when servers, proxies, or external APIs return HTML or text instead of JSON.
 */

/**
 * Safely parses the JSON body of a Response object.
 * Returns null instead of throwing if the response is HTML, plain text, or invalid JSON.
 */
export async function safeResponseJson<T = any>(response: Response): Promise<T | null> {
  try {
    const text = await response.text();
    if (!text || !text.trim()) return null;
    const trimmed = text.trim();
    
    // Quick guard for HTML pages or plain text "The page could not be found..."
    if (trimmed.startsWith("<") || trimmed.startsWith("The page") || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) {
      return null;
    }
    
    return JSON.parse(trimmed) as T;
  } catch (_) {
    return null;
  }
}

/**
 * Safely executes fetch and parses JSON payload.
 * Throws clean, human-readable Error instances instead of raw SyntaxError when HTML is returned.
 */
export async function safeJsonFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const text = await response.text();
  const trimmed = text.trim();

  if (!response.ok) {
    let errorMsg = `HTTP status ${response.status}`;
    try {
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        const errJson = JSON.parse(trimmed);
        errorMsg = errJson.error || errJson.details || errJson.message || errorMsg;
      } else if (trimmed.startsWith("The page")) {
        errorMsg = `Server Route 404/500 (${trimmed.slice(0, 40)}...)`;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (trimmed.startsWith("<") || trimmed.startsWith("The page") || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) {
    throw new TypeError("Response was non-JSON (HTML or text returned by server/proxy).");
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch (err: any) {
    throw new TypeError(`Invalid JSON payload: ${err.message}`);
  }
}
