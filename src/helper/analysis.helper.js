export function getDeviceType() {
    const width = window.innerWidth;

    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";

    return "desktop";
}

export function getBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Edg")) return "Edge";

    if (userAgent.includes("Chrome")) return "Chrome";

    if (userAgent.includes("Firefox")) return "Firefox";

    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";

    return "Unknown";
}

export function getOperatingSystem() {
    
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Windows")) return "Windows";

    if (userAgent.includes("Mac OS")) return "macOS";

    if (userAgent.includes("Android")) return "Android";

    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";

    if (userAgent.includes("Linux")) return "Linux";

    return "Unknown";
}