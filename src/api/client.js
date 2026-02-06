const API_BASE = process.env.REACT_APP_API_BASE || "";

const buildUrl = (path) => `${API_BASE}${path}`;

const getErrorMessage = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }

  const text = await response.text().catch(() => "");
  if (contentType.includes("text/html") || text.trim().startsWith("<!DOCTYPE")) {
    return "Fetch error: backend route not found or server unavailable.";
  }

  return text || "Request failed.";
};

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const config = { method, headers: { ...headers } };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
    config.headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(buildUrl(path), config);
  } catch (error) {
    throw new Error("Backend is unavailable. Check your API server and REACT_APP_API_BASE.");
  }

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) return null;

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  if (
    (contentType.includes("text/html") || text.trim().startsWith("<!DOCTYPE")) &&
    path.startsWith("/api/")
  ) {
    throw new Error(
      "Fetch error: backend route not found or server unavailable.",
    );
  }

  return text;
}
