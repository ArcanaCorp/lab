const STORAGE_KEY = "alglab-algorithms";

export function getAlgorithms() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const algorithms = localStorage.getItem(STORAGE_KEY);

        return algorithms ? JSON.parse(algorithms) : [];
    } catch (error) {
        console.error("Error leyendo algoritmos:", error);
        return [];
    }
}

export function getAlgorithmBySlug(slug) {
    const algorithms = getAlgorithms();

    return algorithms.find(
        (algorithm) => algorithm.slug === slug
    ) ?? null;
}

export function createAlgorithm() {
    const algorithms = getAlgorithms();

    const slug = crypto.randomUUID();

    const algorithm = {
        slug,
        title: "",
        source: "",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
            ...algorithms,
            algorithm,
        ])
    );

    window.dispatchEvent(new Event("algorithms-updated"));

    return algorithm;
}

export function updateAlgorithm(slug, data) {
    const algorithms = getAlgorithms();

    const updatedAlgorithms = algorithms.map((algorithm) => {
        if (algorithm.slug !== slug) {
            return algorithm;
        }

        return {
            ...algorithm,
            ...data,
            updated: new Date().toISOString(),
        };
    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedAlgorithms)
    );

    window.dispatchEvent(new Event("algorithms-updated"));

    return updatedAlgorithms.find(
        (algorithm) => algorithm.slug === slug
    ) ?? null;
}