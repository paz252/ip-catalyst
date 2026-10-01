import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const showLoading = useCallback((msg = "Processing...") => {
        setMessage(msg);
        setLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setLoading(false);
        setMessage("");
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, message, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useGlobalLoading = () => useContext(LoadingContext);