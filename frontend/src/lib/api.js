import { getAccessToken } from "@/lib/auth-storage";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, data = null, errors = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.errors = errors;
  }
}

function createUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  return `${API_BASE_URL}/${String(endpoint).replace(/^\//, "")}`;
}

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    signal,
    auth = true,
    credentials = "include",
  } = options;

  const token = auth ? getAccessToken() : null;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = {
    Accept: "application/json",
    ...(!isFormData && body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let response;

  try {
    response = await fetch(createUrl(endpoint), {
      method,
      headers: requestHeaders,
      body:
        body === undefined || body === null || isFormData
          ? body
          : JSON.stringify(body),
      signal,
      credentials,
      cache: "no-store",
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to the server. Check the API URL and backend status.",
      { data: error }
    );
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}.`,
      {
        status: response.status,
        data,
        errors: data?.errors || null,
      }
    );
  }

  return data;
}

export const api = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "POST", body });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PUT", body });
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: "PATCH", body });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
  },
};

export { API_BASE_URL };
