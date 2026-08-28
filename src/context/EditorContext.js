"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAlgorithmBySlug, updateAlgorithm, saveAlgorithm } from "../lib/algorithms";
import { createClient } from "../lib/supabase/client";

const EditorContext = createContext(null);

export const EditorProvider = ({ children, slug }) => {

    const [algorithm, setAlgorithm] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState("");

    const [activeView, setActiveView] = useState("pseudocode");
    const [activePanel, setActivePanel] = useState("terminal");
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {

                if (!slug) return;

                const data = await getAlgorithmBySlug(slug);

                if (cancelled) return;

                if (!data) return console.warn("Proyecto no encontrado:", slug);

                setAlgorithm(data);
                setTitle(data.title || "");

            } catch (error) {
                if (!cancelled) {
                    console.error("Error al cargar el algoritmo:", error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };

    }, [slug]);

    useEffect(() => {
        if (!algorithm?.slug || !algorithm?.isSynced) {
            return;
        }

        const supabase = createClient();

        const channel = supabase
            .channel(`project:${algorithm.slug}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "projects",
                    filter: `slug=eq.${algorithm.slug}`,
                },
                (payload) => {
                    const project = payload.new;

                    console.log(
                        "Proyecto actualizado desde Realtime:",
                        project
                    );

                    const cloudUpdated = new Date(
                        project.updated_at
                    ).getTime();

                    const localUpdated = new Date(
                        algorithm.updated
                    ).getTime();

                    /*
                    * Si la nube no es más reciente,
                    * no hacemos nada.
                    */

                    if (cloudUpdated <= localUpdated) {
                        return;
                    }

                    const updatedAlgorithm = {
                        ...algorithm,

                        slug: project.slug,
                        title: project.title || "",
                        source: project.source || "",

                        version: project.version,

                        isSynced: true,
                        isPublic: project.is_public ?? false,

                        created: project.created_at,
                        updated: project.updated_at,
                    };

                    console.log(
                        "Aplicando actualización remota:",
                        updatedAlgorithm
                    );

                    /*
                    * Guardar en local
                    */

                    saveAlgorithm(updatedAlgorithm);

                    /*
                    * Actualizar React
                    */

                    setAlgorithm(updatedAlgorithm);
                    setTitle(updatedAlgorithm.title || "");
                }
            )
            .subscribe((status) => {
                console.log(
                    `Realtime project ${algorithm.slug}:`,
                    status
                );
            });

        return () => {
            supabase.removeChannel(channel);
        };

    }, [algorithm?.slug, algorithm?.isSynced]);


    /*
     * =========================
     * TITLE
     * =========================
     */

    const startEditingTitle = useCallback(() => {
        if (!algorithm) return;

        setTitle(algorithm.title || "");
        setEditingTitle(true);
    }, [algorithm]);


    const cancelEditingTitle = useCallback(() => {
        setTitle(algorithm?.title || "");
        setEditingTitle(false);
    }, [algorithm]);


    const saveTitle = useCallback(() => {
        if (!algorithm) return;

        const newTitle = title.trim();

        const updated = updateAlgorithm(
            algorithm.slug,
            {
                title: newTitle,
            }
        );

        if (updated) {
            setAlgorithm(updated);
            setTitle(updated.title || "");
        }

        setEditingTitle(false);
    }, [algorithm, title]);


    const handleTitleChange = useCallback((value) => {
        setTitle(value);
    }, []);


    const handleTitleKeyDown = useCallback((event) => {

        if (event.key === "Enter") {
            event.preventDefault();

            saveTitle();
        }

        if (event.key === "Escape") {
            event.preventDefault();

            cancelEditingTitle();
        }

    }, [saveTitle, cancelEditingTitle]);


    /*
     * =========================
     * UPDATE ALGORITHM
     * =========================
     */

    const update = useCallback((data) => {

        if (!algorithm) {
            return null;
        }

        const updated = updateAlgorithm(
            algorithm.slug,
            data
        );

        if (updated) {
            setAlgorithm(updated);
        }

        return updated;

    }, [algorithm]);

    const updateSource = useCallback((source) => {

        if (!algorithm) {
            return null;
        }

        const updated = updateAlgorithm(algorithm.slug, { source });

        if (updated) {
            setAlgorithm(updated);
        }

        return updated;

    }, [algorithm]);

    const toogleMinimized = () => setMinimized(!minimized)


    /*
     * =========================
     * CONTEXT
     * =========================
     */

    const contextValue = {
        algorithm,
        loading,

        // Title
        title,
        editingTitle,

        startEditingTitle,
        cancelEditingTitle,
        saveTitle,
        handleTitleChange,
        handleTitleKeyDown,

        // Algorithm
        update,
        setAlgorithm,
        updateSource,

        // Views
        activeView,
        setActiveView,
        activePanel,
        setActivePanel,
        minimized,
        toogleMinimized

    };


    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};


export const useEditor = () => {

    const context = useContext(EditorContext);

    if (!context) {
        throw new Error(
            "useEditor debe utilizarse dentro de un EditorProvider"
        );
    }

    return context;
};
