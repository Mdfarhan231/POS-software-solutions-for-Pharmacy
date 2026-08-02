const TOKEN_KEY = "pharmadesk_access_token";
const USER_KEY = "pharmadesk_user";

function isBrowser() {
  return typeof window !== "undefined";
}

function readFrom(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeTo(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
}

function removeFrom(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage cleanup errors.
  }
}

export function getAccessToken() {
  if (!isBrowser()) return null;

  return (
    readFrom(window.localStorage, TOKEN_KEY) ||
    readFrom(window.sessionStorage, TOKEN_KEY)
  );
}

export function getStoredUser() {
  if (!isBrowser()) return null;

  const serializedUser =
    readFrom(window.localStorage, USER_KEY) ||
    readFrom(window.sessionStorage, USER_KEY);

  if (!serializedUser) return null;

  try {
    return JSON.parse(serializedUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession({ token, user, rememberMe = false }) {
  if (!isBrowser()) return;

  clearAuthSession();

  const storage = rememberMe ? window.localStorage : window.sessionStorage;

  if (token) {
    writeTo(storage, TOKEN_KEY, token);
  }

  if (user) {
    writeTo(storage, USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (!isBrowser()) return;

  for (const storage of [window.localStorage, window.sessionStorage]) {
    removeFrom(storage, TOKEN_KEY);
    removeFrom(storage, USER_KEY);
  }
}
