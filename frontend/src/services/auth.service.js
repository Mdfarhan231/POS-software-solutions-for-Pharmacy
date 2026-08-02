import { api } from "@/lib/api";
import {
  clearAuthSession,
  getStoredUser,
  saveAuthSession,
} from "@/lib/auth-storage";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function createMockUser({ username, counter }) {
  return {
    id: 1,
    username,
    name:
      username === "demo"
        ? "Dr. Farhan (Pharmacist-in-Charge)"
        : username,
    role: "Pharmacist",
    counter,
    avatarUrl: null,
  };
}

export function getCurrentUser() {
  return getStoredUser();
}

export async function login(credentials) {
  let result;

  if (USE_MOCK_AUTH) {
    await wait(600);

    if (
      credentials.username !== "demo" ||
      credentials.password !== "pharmadesk123"
    ) {
      throw new Error("Invalid demo username or password.");
    }

    result = {
      user: createMockUser(credentials),
      token: "local-demo-token",
    };
  } else {
    const response = await api.post(
      "/login",
      {
        username: credentials.username,
        password: credentials.password,
        counter: credentials.counter,
        remember_me: credentials.rememberMe,
      },
      { auth: false }
    );

    const payload = response?.data || response;
    const token = payload?.token || payload?.access_token;
    const user = payload?.user;

    if (!token || !user) {
      throw new Error(
        "The login response must contain a user and an access token."
      );
    }

    result = { user, token };
  }

  saveAuthSession({
    ...result,
    rememberMe: credentials.rememberMe,
  });

  return result;
}

export async function requestPasswordReset(email) {
  if (USE_MOCK_AUTH) {
    await wait(700);
    return { message: "Recovery instructions sent." };
  }

  return api.post("/forgot-password", { email }, { auth: false });
}

export async function logout() {
  try {
    if (!USE_MOCK_AUTH) {
      await api.post("/logout");
    }
  } finally {
    clearAuthSession();
  }
}
