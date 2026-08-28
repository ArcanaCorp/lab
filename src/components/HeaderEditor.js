"use client";

import {
    IconChevronLeft,
    IconDeviceFloppy,
    IconPlayerPause,
    IconPlayerPlay,
    IconReload,
    IconSettings
} from "@tabler/icons-react";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor } from "../context/EditorContext";

export default function HeaderEditor({ onRun, activeView, setActiveView }) {

    const router = useRouter();

    const inputRef = useRef(null);

    const { algorithm, title, editingTitle, startEditingTitle, cancelEditingTitle, saveTitle, handleTitleChange, handleTitleKeyDown } = useEditor();

    if (!algorithm) {
        return null;
    }

    return (
        <header className="w-full h bg-dark border-bottom" style={{ "--h": "60px" }} >

            <div className="w m-auto h-full flex items-center justify-between" style={{ "--w": "90%" }} >

                {/* IZQUIERDA */}

                <div className="flex items-center gap-sm">

                    <button className="square center rounded-sm bg-dark-secondary text-white" style={{ "--square": "40px" }} onClick={() => router.back()}><IconChevronLeft /></button>
                    {editingTitle ? (
                        <input ref={inputRef} type="text" value={title} onChange={(event) => handleTitleChange(event.target.value)} onBlur={saveTitle} onKeyDown={handleTitleKeyDown} placeholder="Sin título" className="px-sm py-md bg-dark-secondary text-white rounded-md" />
                    ) : (
                        <h1 onClick={startEditingTitle} className="text-lg fw-semibold pointer" title="Haz clic para editar" >{algorithm.title || "Sin título"}</h1>
                    )}
                    <p className="text-xs bg-dark-secondary py-xs px-sm border-bottom rounded-full">Guardado localmente</p>

                </div>


                {/* CENTRO */}

                <div className="flex items-center gap-md">

                    <button className="btn bg-dark-secondary btn-sm text-white" onClick={() => router.push("/docs")}>Docs</button>
                    <button className={`btn btn-sm ${activeView === "pseudocode" ? "bg-primary" : "bg-dark-secondary text-white"}`} onClick={() => setActiveView("pseudocode")}>Pseudocódigo</button>
                    <button className={`btn btn-sm ${activeView === "flowchart" ? "bg-primary" : "bg-dark-secondary text-white"}`} onClick={() => setActiveView("flowchart")}>Diagrama</button>
                    <button className={`btn btn-sm ${activeView === "code" ? "bg-primary" : "bg-dark-secondary text-white"}`} onClick={() => setActiveView("code")}>Código</button>

                </div>


                {/* DERECHA */}

                <div className="flex items-center gap-sm">
                    <button className="btn btn-primary btn-sm" onClick={onRun}><IconPlayerPlay fill="#000" />Run </button>
                </div>

            </div>

        </header>
    );
}