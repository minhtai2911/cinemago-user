const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FetcherOptions extends RequestInit {
  headers?: Record<string, string>;
  cache?: "force-cache" | "no-cache" | "reload";
}

export async function fetcher<T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const response = await fetch(`${baseURL}/${url}`, {
    ...options,
    cache: options.cache || "no-cache",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(
      data?.error || `Request failed with status ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}
