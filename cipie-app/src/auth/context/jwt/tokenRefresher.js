import { jwtDecode } from "jwt-decode";

import { getRefreshToken } from "./action";

let refreshTimeout = null;
let isRefreshing = false;

// refresh 2 minutes before token expiry
const REFRESH_BUFFER_MS = 2 * 60 * 1000;
const MIN_FALLBACK_DELAY_MS = 5000;

export const startTokenRefresh = () => {
    // prevent duplicate timers
    if (refreshTimeout) return;

    scheduleNextRefresh();
};

const scheduleNextRefresh = () => {
    const token = sessionStorage.getItem("jwt_access_token");

    if (!token) {
        // console.log("No access token found. Refresh scheduler stopped.");
        return;
    }

    try {
        const decoded = jwtDecode(token);

        if (!decoded?.exp) {
            // console.error("JWT has no exp claim");
            return;
        }

        const expiryTime = decoded.exp * 1000;
        const now = Date.now();

        // Refresh 2 min before expiry
        let delay = expiryTime - now - REFRESH_BUFFER_MS;

        // Safety guard
        if (delay < MIN_FALLBACK_DELAY_MS) {
            delay = MIN_FALLBACK_DELAY_MS;
        }

        // console.log(
        //     `Next token refresh in ${Math.floor(delay / 1000)} seconds`
        // );

        refreshTimeout = setTimeout(async () => {

            if (isRefreshing) return;

            try {
                isRefreshing = true;

                // console.log("Refreshing token...");

                await getRefreshToken();

                // console.log("Token refreshed successfully");

                // clear current timeout reference
                refreshTimeout = null;

                // schedule again using NEW token expiry
                scheduleNextRefresh();

            } catch (err) {

                console.error(
                    "Refresh failed:",
                    err?.response?.status || err
                );

                refreshTimeout = null;

                if (err?.response?.status === 401) {
                    stopTokenRefresh();

                    sessionStorage.clear();

                    window.location.href = "/auth/jwt/sign-in";
                }

            } finally {
                isRefreshing = false;
            }

        }, delay);

    } catch (err) {
        console.error("Invalid JWT token:", err);
    }
};

export const stopTokenRefresh = () => {
    if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
    }
};