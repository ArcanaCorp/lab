"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconFile, IconTrash } from "@tabler/icons-react";
import { formatDatePeru } from "../helper/time.helper";
import DialogDelete from "./DialogDelete";

export default function AlgorithmCard({ alg, onDelete }) {
    const dialogRef = useRef(null);

    const [menu, setMenu] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const openDeleteDialog = () => {
        setMenu(null);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        onDelete(alg.slug);
        setDeleteDialogOpen(false);
    };

    const handleContextMenu = (event) => {
        event.preventDefault();

        setMenu({
            x: event.clientX,
            y: event.clientY,
        });
    };

    // Abrir/cerrar el dialog nativo según el estado de React
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (deleteDialogOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [deleteDialogOpen]);

    // Cerrar menú contextual al hacer click fuera
    useEffect(() => {
        const closeMenu = () => {
            setMenu(null);
        };

        document.addEventListener("click", closeMenu);

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, []);

    // Permitir cerrar con ESC
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        const handleClose = () => {
            setDeleteDialogOpen(false);
        };

        dialog.addEventListener("close", handleClose);

        return () => {
            dialog.removeEventListener("close", handleClose);
        };
    }, []);

    useEffect(() => {
        if (deleteDialogOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [deleteDialogOpen]);

    return (
        <>
            <Link
                href={`/editor/${alg.slug}`}
                className="text-white"
                onContextMenu={handleContextMenu}
            >
                <article className="h-full bg-dark-secondary flex flex-col gap-sm p-md text-center rounded-md border-bottom">
                    <span
                        className="center square rounded-full m-auto"
                        style={{ "--square": "60px" }}
                    >
                        <IconFile size={32} />
                    </span>

                    <h3>{alg.title || "Sin titulo"}</h3>

                    <time className="text-xs text-gray">
                        {formatDatePeru(alg.created)}
                    </time>
                </article>
            </Link>

            {/* Context menu */}
            {menu && (
                <div
                    className="context-menu p-md rounded-md bg-dark border text-white"
                    style={{
                        position: "fixed",
                        top: menu.y,
                        left: menu.x,
                        zIndex: 1000,
                    }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="flex items-center gap-sm fw-medium text-error"
                        onClick={openDeleteDialog}
                    >
                        <IconTrash size={18} />
                        Eliminar
                    </button>
                </div>
            )}

            <DialogDelete alg={alg} dialogRef={dialogRef} closeDeleteDialog={closeDeleteDialog} handleDelete={handleDelete} />
        </>
    );
}