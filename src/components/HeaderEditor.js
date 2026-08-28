"use client";

import {
    IconChevronLeft,
    IconCloud,
    IconLink,
    IconRefresh,
    IconPlayerPlay,
} from "@tabler/icons-react";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useEditor } from "../context/EditorContext";
import { useAnalysis } from "../context/AnalysisContext";

import { toast } from "sonner";
import { parseResponse } from "../helper/projects.helper";

export default function HeaderEditor({
    onRun,
    activeView,
    setActiveView,
}) {
    const router = useRouter();
    const pathname = usePathname();

    const inputRef = useRef(null);

    const [sharing, setSharing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [shareUrl, setShareUrl] = useState(null);

    const { trackEvent } = useAnalysis();

    const {
        algorithm,
        title,
        editingTitle,
        startEditingTitle,
        saveTitle,
        handleTitleChange,
        handleTitleKeyDown,
        syncFromCloud,
    } = useEditor();

    if (!algorithm) {
        return null;
    }

    /*
     * --------------------------------------------------
     * ANALYTICS
     * --------------------------------------------------
     */

    const analyticsMetadata = {
        projectId: algorithm.slug,
        resourceType: "algorithm",
        resourceId: algorithm.slug,
        sourcePath: pathname,
    };

    /*
     * --------------------------------------------------
     * TABS
     * --------------------------------------------------
     */

    const handleNavigateTabs = async (tab) => {
        if (tab === activeView) {
            return;
        }

        const previousView = activeView;

        setActiveView(tab);

        await trackEvent("editor_view_changed", {
            elementType: "button",
            elementId: `editor-tab-${tab}`,
            elementText: getTabLabel(tab),
            metadata: {
                ...analyticsMetadata,
                fromView: previousView,
                toView: tab,
            },
        });
    };

    /*
     * --------------------------------------------------
     * BACK
     * --------------------------------------------------
     */

    const handleBack = async () => {
        await trackEvent("editor_back_clicked", {
            elementType: "button",
            elementId: "editor-back",
            elementText: "Volver",
            metadata: {
                ...analyticsMetadata,
            },
        });

        router.back();
    };

    /*
     * --------------------------------------------------
     * DOCS
     * --------------------------------------------------
     */

    const handleDocs = async () => {
        await trackEvent("editor_docs_clicked", {
            elementType: "button",
            elementId: "editor-docs",
            elementText: "Docs",
            metadata: {
                ...analyticsMetadata,
                destinationPath: "/docs",
            },
        });

        router.push("/docs");
    };

    /*
     * --------------------------------------------------
     * RUN
     * --------------------------------------------------
     */

    const handleRun = async () => {
        await trackEvent("algorithm_run", {
            elementType: "button",
            elementId: "editor-run",
            elementText: "Run",
            metadata: {
                ...analyticsMetadata,
                activeView,
            },
        });

        onRun();
    };

    /*
     * --------------------------------------------------
     * TITLE
     * --------------------------------------------------
     */

    const handleStartEditingTitle = async () => {
        await trackEvent("algorithm_title_edit_started", {
            elementType: "heading",
            elementId: "algorithm-title",
            elementText: title || "Sin título",
            metadata: {
                ...analyticsMetadata,
            },
        });

        startEditingTitle();
    };

    const handleSaveTitle = async () => {
        await trackEvent("algorithm_title_updated", {
            elementType: "input",
            elementId: "algorithm-title-input",
            elementText: title || "Sin título",
            metadata: {
                ...analyticsMetadata,
                title: title || null,
            },
        });

        saveTitle();
    };

    /*
     * --------------------------------------------------
     * GUARDAR / ACTUALIZAR NUBE
     * --------------------------------------------------
     */

    const handleSave = async () => {
        if (saving || syncing) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/projects/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project: {
                        slug: algorithm.slug,
                        title: title || algorithm.title || "Sin título",
                        source: algorithm.source || "",
                        updated: algorithm.updated,
                    },
                }),
            });

            const data = await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.error || "No se pudo guardar el proyecto"
                );
            }

            /*
             * El endpoint debería devolver el proyecto
             * actualizado. Si lo devuelve, actualizamos
             * también el estado del editor.
             */

            if (data?.project && syncFromCloud) {
                await syncFromCloud(data.project);
            }

            await trackEvent("project_cloud_saved", {
                elementType: "button",
                elementId: "project-save-cloud",
                elementText: "Guardar",
                metadata: {
                    ...analyticsMetadata,
                },
            });

            toast.success(
                algorithm.isSynced
                    ? "Proyecto actualizado"
                    : "Proyecto guardado en nube"
            );

        } catch (error) {
            console.error("Error guardando proyecto:", error);

            toast.error("Error", {
                description:
                    error.message ||
                    "No se pudo guardar el proyecto.",
            });
        } finally {
            setSaving(false);
        }
    };

    /*
     * --------------------------------------------------
     * SINCRONIZAR DESDE NUBE
     * --------------------------------------------------
     */

    const handleSync = async () => {
        if (syncing || saving) {
            return;
        }

        setSyncing(true);

        try {
            const response = await fetch(
                `/api/projects/${encodeURIComponent(algorithm.slug)}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            const data = await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "No se pudo sincronizar el proyecto"
                );
            }

            if (!data?.project) {
                throw new Error(
                    "La nube no devolvió el proyecto"
                );
            }

            /*
             * Actualizar EditorContext + localStorage
             */

            if (syncFromCloud) {
                await syncFromCloud(data.project);
            }

            await trackEvent("project_cloud_synced", {
                elementType: "button",
                elementId: "project-sync",
                elementText: "Sincronizar",
                metadata: {
                    ...analyticsMetadata,
                    version: data.project.version ?? null,
                    updatedAt: data.project.updated_at ?? null,
                },
            });

            toast.success("Proyecto sincronizado");

        } catch (error) {
            console.error(
                "Error sincronizando proyecto:",
                error
            );

            toast.error("Error", {
                description:
                    error.message ||
                    "No se pudo sincronizar el proyecto.",
            });
        } finally {
            setSyncing(false);
        }
    };

    /*
     * --------------------------------------------------
     * GUARDAR + CREAR ENLACE
     * --------------------------------------------------
     */

    const handleSaveAndShare = async () => {
        if (sharing || saving || syncing) {
            return;
        }

        setSharing(true);

        try {
            /*
             * 1. Guardar en nube
             */

            const saveResponse = await fetch("/api/projects/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    project: {
                        slug: algorithm.slug,
                        title:
                            title ||
                            algorithm.title ||
                            "Sin título",
                        source: algorithm.source || "",
                        updated: algorithm.updated,
                    },
                }),
            });

            const saveData = await parseResponse(saveResponse);

            if (!saveResponse.ok) {
                throw new Error(
                    saveData?.error ||
                    "No se pudo guardar el proyecto"
                );
            }

            /*
             * 2. Crear/reutilizar share
             */

            const shareResponse = await fetch(
                "/api/projects/share",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        projectId: algorithm.slug,
                        sourcePath: pathname,
                    }),
                }
            );

            const shareData = await parseResponse(shareResponse);

            if (!shareResponse.ok) {
                throw new Error(
                    shareData?.error ||
                    "No se pudo crear el enlace"
                );
            }

            /*
             * 3. Guardar URL en estado
             */

            setShareUrl(shareData.url);

            /*
             * 4. Copiar automáticamente
             */

            await navigator.clipboard.writeText(
                shareData.url
            );

            /*
             * 5. Analytics
             */

            await trackEvent("project_shared", {
                elementType: "button",
                elementId: "project-share",
                elementText: "Guardar y compartir",
                metadata: {
                    ...analyticsMetadata,
                    shareId:
                        shareData.share?.id || null,
                    shortCode:
                        shareData.share?.short_code || null,
                    shareUrl:
                        shareData.url || null,
                },
            });

            toast.success(
                shareData.created
                    ? "Proyecto guardado y enlace creado"
                    : "Proyecto actualizado y enlace copiado"
            );

        } catch (error) {
            console.error(
                "Error guardando y compartiendo:",
                error
            );

            toast.error("Error", {
                description:
                    error.message ||
                    "No se pudo guardar y compartir.",
            });
        } finally {
            setSharing(false);
        }
    };

    /*
     * --------------------------------------------------
     * COPIAR LINK
     * --------------------------------------------------
     */

    const handleCopyShareLink = async () => {
        if (!shareUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                shareUrl
            );

            await trackEvent(
                "project_share_link_copied",
                {
                    elementType: "button",
                    elementId: "project-share-copy",
                    elementText: "Copiar enlace",
                    metadata: {
                        ...analyticsMetadata,
                        shareUrl,
                    },
                }
            );

            toast.success("Enlace copiado");

        } catch (error) {
            console.error(
                "Error copiando enlace:",
                error
            );

            toast.error("Error", {
                description:
                    "No se pudo copiar el enlace.",
            });
        }
    };

    /*
     * --------------------------------------------------
     * UI
     * --------------------------------------------------
     */

    return (
        <header
            className="w-full h bg-dark border-bottom"
            style={{ "--h": "60px" }}
        >
            <div
                className="w m-auto h-full flex items-center justify-between"
                style={{ "--w": "90%" }}
            >

                {/* IZQUIERDA */}

                <div className="flex items-center gap-sm">

                    <button
                        type="button"
                        className="square center rounded-sm bg-dark-secondary text-white"
                        style={{ "--square": "40px" }}
                        onClick={handleBack}
                    >
                        <IconChevronLeft />
                    </button>

                    {editingTitle ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(event) =>
                                handleTitleChange(
                                    event.target.value
                                )
                            }
                            onBlur={handleSaveTitle}
                            onKeyDown={handleTitleKeyDown}
                            placeholder="Sin título"
                            className="px-sm py-md bg-dark-secondary text-white rounded-md"
                        />
                    ) : (
                        <h1
                            onClick={handleStartEditingTitle}
                            className="text-lg fw-semibold pointer"
                            title="Haz clic para editar"
                        >
                            {algorithm.title ||
                                "Sin título"}
                        </h1>
                    )}

                    <p className="text-xs bg-dark-secondary py-xs px-sm border-bottom rounded-full">
                        {algorithm.isSynced
                            ? "Guardado en nube"
                            : "Guardado localmente"}
                    </p>
                </div>

                {/* CENTRO */}

                <div className="flex items-center gap-md">

                    <button
                        type="button"
                        className="btn bg-dark-secondary btn-sm text-white"
                        onClick={handleDocs}
                    >
                        Docs
                    </button>

                    <button
                        type="button"
                        className={`btn btn-sm ${
                            activeView === "pseudocode"
                                ? "bg-primary"
                                : "bg-dark-secondary text-white"
                        }`}
                        onClick={() =>
                            handleNavigateTabs(
                                "pseudocode"
                            )
                        }
                    >
                        Pseudocódigo
                    </button>

                    <button
                        type="button"
                        className={`btn btn-sm ${
                            activeView === "flowchart"
                                ? "bg-primary"
                                : "bg-dark-secondary text-white"
                        }`}
                        onClick={() =>
                            handleNavigateTabs(
                                "flowchart"
                            )
                        }
                    >
                        Diagrama
                    </button>

                    <button
                        type="button"
                        className={`btn btn-sm ${
                            activeView === "code"
                                ? "bg-primary"
                                : "bg-dark-secondary text-white"
                        }`}
                        onClick={() =>
                            handleNavigateTabs("code")
                        }
                    >
                        Código
                    </button>
                </div>

                {/* DERECHA */}

                <div className="flex items-center gap-sm">

                    {/* GUARDAR / COMPARTIR
                        Solo el owner */}

                    {algorithm.isOwner && (
                        <button
                            type="button"
                            className="btn btn-gosh text-white bg-dark-secondary btn-sm"
                            onClick={
                                algorithm.isSynced
                                    ? handleSave
                                    : handleSaveAndShare
                            }
                            disabled={
                                sharing ||
                                saving ||
                                syncing
                            }
                        >
                            <IconCloud />

                            {sharing
                                ? "Preparando..."
                                : saving
                                    ? "Guardando..."
                                    : algorithm.isSynced
                                        ? "Actualizar"
                                        : "Guardar y compartir"}
                        </button>
                    )}

                    {/* SINCRONIZAR */}

                    {algorithm.isSynced && (
                        <button
                            type="button"
                            className="square center bg-dark-secondary text-white rounded-sm"
                            style={{
                                "--square": "36px",
                            }}
                            onClick={handleSync}
                            disabled={
                                syncing ||
                                saving ||
                                sharing
                            }
                            title="Sincronizar desde la nube"
                        >
                            <IconRefresh
                                size={18}
                                className={
                                    syncing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>
                    )}

                    {/* COPIAR ENLACE */}

                    {shareUrl && (
                        <button
                            type="button"
                            className="square center bg-dark-secondary text-white rounded-sm"
                            style={{
                                "--square": "36px",
                            }}
                            onClick={handleCopyShareLink}
                            title="Copiar enlace"
                        >
                            <IconLink size={18} />
                        </button>
                    )}

                    {/* RUN */}

                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleRun}
                    >
                        <IconPlayerPlay fill="#000" />
                        Run
                    </button>
                </div>
            </div>
        </header>
    );
}

function getTabLabel(tab) {
    const labels = {
        pseudocode: "Pseudocódigo",
        flowchart: "Diagrama",
        code: "Código",
    };

    return labels[tab] || tab;
}