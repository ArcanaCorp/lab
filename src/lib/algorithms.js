const STORAGE_KEY = "alglab-algorithms";

/*
 * =========================
 * LOCAL STORAGE
 * =========================
 */

export function getAlgorithms() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const algorithms = localStorage.getItem(STORAGE_KEY);

        if (!algorithms) {
            return [];
        }

        const parsedAlgorithms = JSON.parse(algorithms);

        return parsedAlgorithms.sort(
            (a, b) => new Date(b.created) - new Date(a.created)
        );

    } catch (error) {
        console.error("Error leyendo algoritmos:", error);
        return [];
    }
}


/*
 * =========================
 * NORMALIZE
 * =========================
 */

export function normalizeAlgorithm(project, options = {}) {

    console.log(project);

    if (!project) {
        return null;
    }

    return {
        slug: project.slug,
        title: project.title || "",
        source: project.source || "",
        isOwner: options.isOwner ?? false,
        isSynced: options.isSynced ?? true,
        version: project.version ?? 1,
        isPublic: project.is_public ?? project.isPublic ?? false,
        created: project.created_at ?? project.created ?? new Date().toISOString(),
        updated: project.updated_at ?? project.updated ?? new Date().toISOString(),
    };
}


/*
 * =========================
 * SAVE LOCAL
 * =========================
 */

export function saveAlgorithm(algorithm) {
    if (typeof window === "undefined") {
        return algorithm;
    }

    const algorithms = getAlgorithms();

    const existingIndex = algorithms.findIndex(
        item => item.slug === algorithm.slug
    );

    if (existingIndex >= 0) {
        algorithms[existingIndex] = algorithm;
    } else {
        algorithms.push(algorithm);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(algorithms)
    );

    window.dispatchEvent(
        new Event("algorithms-updated")
    );

    return algorithm;
}


/*
 * =========================
 * GET BY SLUG
 * =========================
 *
 * LOCAL FIRST
 *
 * 1. Busca local
 * 2. Si no existe -> nube
 * 3. Si existe en nube -> guarda local
 */

export async function getAlgorithmBySlug(slug) {
    if (!slug) {
        return null;
    }

    /*
     * Esta función trabaja con localStorage
     * y API desde el navegador.
     */
    if (typeof window === "undefined") {
        return null;
    }

    /*
     * =========================
     * 1. LOCAL
     * =========================
     */

    const localAlgorithm = getAlgorithms().find(
        algorithm => algorithm.slug === slug
    );

    if (localAlgorithm) {
        return localAlgorithm;
    }


    /*
     * =========================
     * 2. NUBE
     * =========================
     */

    try {
        const response = await fetch(
            `/api/projects/${encodeURIComponent(slug)}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        if (response.status === 404) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.error ||
                "No se pudo obtener el proyecto"
            );
        }

        if (!data?.project) {
            return null;
        }


        /*
         * =========================
         * 3. NORMALIZAR
         * =========================
         */

        const algorithm = normalizeAlgorithm(
            data.project,
            {
                isOwner: false,
                isSynced: true,
            }
        );


        /*
         * =========================
         * 4. GUARDAR LOCAL
         * =========================
         */

        saveAlgorithm(algorithm);


        /*
         * =========================
         * 5. DEVOLVER
         * =========================
         */

        return algorithm;

    } catch (error) {

        console.error(
            "Error obteniendo proyecto de nube:",
            error
        );

        return null;
    }
}


/*
 * =========================
 * CREATE
 * =========================
 *
 * Los proyectos nuevos nacen
 * únicamente en local.
 */

export function createAlgorithm() {
    const now = new Date().toISOString();

    const algorithm = {
        slug: crypto.randomUUID(),
        title: "",
        source: "",
        isOwner: true,
        isSynced: false,
        version: 1,
        isPublic: false,
        created: now,
        updated: now,
    };

    saveAlgorithm(algorithm);

    return algorithm;
}


/*
 * =========================
 * UPDATE LOCAL
 * =========================
 */

export function updateAlgorithm(slug, data) {
    const algorithms = getAlgorithms();

    const updatedAlgorithms = algorithms.map(
        algorithm => {

            if (algorithm.slug !== slug) {
                return algorithm;
            }

            return {
                ...algorithm,
                ...data,
                updated: new Date().toISOString(),
            };
        }
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedAlgorithms)
    );

    window.dispatchEvent(
        new Event("algorithms-updated")
    );

    return updatedAlgorithms.find(
        algorithm => algorithm.slug === slug
    ) ?? null;
}


/*
 * =========================
 * DELETE
 * =========================
 */

export function deleteAlgorithm(slug) {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const algorithms = getAlgorithms();

        const filtered = algorithms.filter(
            algorithm => algorithm.slug !== slug
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(filtered)
        );

        window.dispatchEvent(
            new Event("algorithms-updated")
        );

    } catch (error) {
        console.error(
            "Error eliminando algoritmo:",
            error
        );
    }
}