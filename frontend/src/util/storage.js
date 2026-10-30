/**
 * Token storage utility.
 *
 * Edge's "Tracking Prevention" feature can silently block localStorage writes
 * for localhost origins.  We use sessionStorage for the JWT (session-scoped,
 * never affected by tracking-prevention) and keep localStorage only for the
 * non-sensitive user-profile object so it survives tab refreshes.
 */

// ── token (sessionStorage) ──────────────────────────────────────────────────

export const saveToken = (token) => {
    try { sessionStorage.setItem("financial-new.jwt", token); } catch { /* blocked */ }
};

export const getToken = () => {
    try { return sessionStorage.getItem("financial-new.jwt"); } catch { return null; }
};

export const removeToken = () => {
    try { sessionStorage.removeItem("financial-new.jwt"); } catch { /* blocked */ }
    // Xóa token cũ từ phiên bản trước để không dùng nhầm JWT không cùng secret.
    try { sessionStorage.removeItem("token"); localStorage.removeItem("token"); } catch { /* blocked */ }
};

// ── user profile (localStorage, with sessionStorage fallback) ───────────────

export const saveUser = (user) => {
    const value = JSON.stringify(user);
    try {
        localStorage.setItem("user", value);
    } catch {
        try { sessionStorage.setItem("user", value); } catch { /* blocked */ }
    }
};

export const loadUser = () => {
    try {
        const v = localStorage.getItem("user") ?? sessionStorage.getItem("user");
        return v ? JSON.parse(v) : null;
    } catch {
        return null;
    }
};

export const removeUser = () => {
    try { localStorage.removeItem("user"); } catch { /* ignored */ }
    try { sessionStorage.removeItem("user"); } catch { /* ignored */ }
};
