/**
 * Decoupled API client.
 *
 * Replace `mockFetch` with a real HTTP layer (Axios or fetch) pointing at the
 * Django REST backend. Service modules import only `request` so swapping the
 * transport is a one-file change.
 */

const BASE_URL = "/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// In real life this would be `fetch(BASE_URL + path, …)`.
// For the mock build it's just a typed pass-through that the service files
// bypass — kept here so the abstraction is documented and ready.
export async function request<T>(path: string, _opts: RequestOptions = {}): Promise<T> {
  void BASE_URL;
  void path;
  // The service layer currently returns mocked promises directly.
  return Promise.reject(new ApiError(501, "Not implemented — using mock services."));
}

/** Helper: simulate network latency for mock services. */
export function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
