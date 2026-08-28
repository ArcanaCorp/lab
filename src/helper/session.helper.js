const SESSION_STORAGE_KEY = "analytics_session_token";

export function getSessionToken() {
    if (typeof window === "undefined") {
        return null;
    }

    let token = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!token) {
        token = crypto.randomUUID();
        sessionStorage.setItem(SESSION_STORAGE_KEY,token);
    }

    return token;
}