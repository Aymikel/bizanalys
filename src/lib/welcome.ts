export const WELCOME_KEY = "ba-welcome-seen";

/** Re-show the welcome splash if it hasn't been seen in this window. */
export const WELCOME_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/** How long the splash stays up before continuing automatically. */
export const WELCOME_AUTO_MS = 5000;

export function welcomeIsFresh(): boolean {
  try {
    const raw = localStorage.getItem(WELCOME_KEY);
    if (!raw) return false;
    // Legacy value "1" — treat as stale so the timed splash takes over.
    const ts = Number(raw);
    if (!Number.isFinite(ts) || ts <= 0) return false;
    return Date.now() - ts < WELCOME_TTL_MS;
  } catch {
    return true;
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
