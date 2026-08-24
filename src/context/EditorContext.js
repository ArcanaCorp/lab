"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAlgorithmBySlug, updateAlgorithm } from "../lib/algorithms";

const EditorContext = createContext(null);

export const EditorProvider = ({ children, slug }) => {

    const [algorithm, setAlgorithm] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState("");

    /*
     * =========================
     * LOAD ALGORITHM
     * =========================
     */

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!slug) {
                setLoading(false);
                return;
            }

            const data = getAlgorithmBySlug(slug);

            if (data) {
                setAlgorithm(data);
                setTitle(data.title || "");
            }

            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [slug]);


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
