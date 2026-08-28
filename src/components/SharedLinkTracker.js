"use client";

import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRouter } from "next/navigation";
import { useAnalysis } from "../context/AnalysisContext";

export default function SharedLinkTracker({ code }) {

    const router = useRouter();

    const {
        visitorId,
        sessionId,
    } = useAnalysis();

    useEffect(() => {

        let cancelled = false;

        const track = async () => {

            try {

                if (!visitorId) {
                    return;
                }

                const response = await fetch(
                    "/api/analytics/share/visit",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            code,
                            visitorId,
                            sessionId,
                            referrer: document.referrer || null,
                        }),
                    }
                );

                const data = await response.json();

                if (cancelled) {
                    return;
                }

                if (!response.ok) {
                    console.error(
                        "Error share:",
                        data
                    );

                    router.replace("/404");
                    return;
                }

                if (!data.destination) {
                    router.replace("/404");
                    return;
                }

                router.replace(`${data.destination}?shared=1`);

            } catch (error) {

                console.error(
                    "Error procesando shared link:",
                    error
                );

                if (!cancelled) {
                    router.replace("/404");
                }
            }
        };

        track();

        return () => {
            cancelled = true;
        };

    }, [
        code,
        visitorId,
        sessionId,
        router,
    ]);

    return null;
}