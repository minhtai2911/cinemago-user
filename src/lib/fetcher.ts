const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetcher(url: string, options: RequestInit = {}) {
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

  return response.json();
}
