"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAnalysis } from "../context/AnalysisContext";

export default function AnalyticsTracker() {
    
    const pathname = usePathname();
    const { visitorId, trackPageView } = useAnalysis();

    useEffect(() => {
        if (!visitorId) return;
        trackPageView(pathname);
    }, [ pathname, visitorId, trackPageView ]);

    return null;
}