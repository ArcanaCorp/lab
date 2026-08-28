"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getBrowser, getDeviceType, getOperatingSystem } from "../helper/analysis.helper";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getSessionToken } from "../helper/session.helper";

export const AnalysisContext = createContext(null);

const SESSION_KEY = "analysis_session_token";

export const AnalysisProvider = ({ children }) => {

    const [visitorId, setVisitorId] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const initialized = useRef(false);

    const registerVisitor = useCallback(async (id) => {
        try {
            const response = await fetch("/api/analytics/visitor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    visitorId: id,
                    landingPage: window.location.pathname,
                    referrer: document.referrer || null,
                    language: navigator.language || null,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
                    deviceType: getDeviceType(),
                    browser: getBrowser(),
                    os: getOperatingSystem(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Error API /api/analytics/visitor:", { status: response.status, statusText: response.statusText, data: errorData});
                throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        
        } catch (error) {
            console.error("Analytics visitor:", error);
            throw error;
        }
    }, []);

    const createSession = useCallback(async (id) => {
        
        const token = getSessionToken();

        setSessionToken(token);

        const url = new URL(window.location.href);

        const response = await fetch("/api/analytics/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                visitorId: id,
                sessionToken: token,
                landingPage: window.location.pathname,
                referrer: document.referrer || null,
                utmSource:url.searchParams.get("utm_source"),
                utmMedium:url.searchParams.get("utm_medium"),
                utmCampaign:url.searchParams.get("utm_campaign"),
                utmTerm:url.searchParams.get("utm_term"),
                utmContent:url.searchParams.get("utm_content"),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Error API /api/analytics/session:", { status: response.status, statusText: response.statusText, data: errorData});
            throw new Error(errorData?.error || `Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }, []);

    useEffect(() => {

        if (initialized.current) return;

        initialized.current = true;

        const initialize = async () => {
            try {
                setIsLoading(true);
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                const id = result.visitorId;
                setVisitorId(id);
                await registerVisitor(id);
                await createSession(id);
            } catch (error) {
                console.error("Error inicializando analytics:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, [registerVisitor, createSession]);

    const trackPageView = useCallback(async (path = window.location.pathname) => {
        
        if (!visitorId) return;

        try {
        
            const response = await fetch("/api/analytics/page-view", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    visitorId,
                    sessionToken,
                    path,
                    pageTitle: document.title,
                    referrer: document.referrer || null,
                }),
            });

            if (!response.ok) throw new Error("Error registrando page view");

            return await response.json();

        } catch (error) {
            console.error("Analytics page view:", error);
        }
    }, [visitorId, sessionToken]);

    const trackEvent = useCallback(async (eventName, { elementType = null, elementId = null, elementText = null, metadata = {} } = {} ) => {

        if (!visitorId) return;

        try {

            const response = await fetch("/api/analytics/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    visitorId,
                    sessionToken,
                    eventName,
                    elementType,
                    elementId,
                    elementText,
                    path: window.location.pathname,
                    metadata,
                }),
            });

            if (!response.ok) throw new Error("Error registrando evento");

            return await response.json();

        } catch (error) {
            console.error("Analytics event:", error);
        }

    }, [visitorId, sessionToken]);

    const createShareLink = useCallback(async ({resourceType, resourceId}) => {
        
        if (!visitorId) return null;

        try {

            const response = await fetch("/api/analytics/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    visitorId,
                    resourceType,
                    resourceId,
                    sourcePath: window.location.pathname,
                }),
            });

            if (!response.ok) throw new Error("No se pudo crear el enlace");

            const result = await response.json();

            await trackEvent("share_created", {
                elementType:"button",
                elementId:"share-button",
                metadata: {
                    shareId: result.share?.id,
                    shortCode: result.share?.short_code,
                    resourceType,
                    resourceId,
                },
            });

            return result;
            
        } catch (error) {
            console.error("Analytics share:", error);
            return null;
        }

    }, [visitorId, trackEvent]);

    const contextValue = {
        visitorId,
        sessionToken,
        isLoading,
        error,
        trackPageView,
        trackEvent,
        createShareLink,
    };

    return (
        <AnalysisContext.Provider value={contextValue}>{children}</AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) throw new Error("useAnalysis debe utilizarse dentro de AnalysisProvider");
    return context;
};