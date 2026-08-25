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
        <header className="w-full h bg-white border-b" style={{ "--h": "60px" }} >

            <div className="w m-auto h-full flex items-center justify-between" style={{ "--w": "90%" }} >

                {/* IZQUIERDA */}

                <div className="flex items-center gap-sm">

                    <button className="square center rounded-sm bg-gray-100" style={{ "--square": "40px" }} onClick={() => router.back()}><IconChevronLeft /></button>

                    {editingTitle ? (

                        <input ref={inputRef} type="text" value={title} onChange={(event) => handleTitleChange(event.target.value)} onBlur={saveTitle} onKeyDown={handleTitleKeyDown} placeholder="Sin título" className="border border-solid border-gray px-sm" />

                    ) : (

                        <h1 onClick={startEditingTitle} className="text-lg fw-semibold pointer" title="Haz clic para editar" >{algorithm.title || "Sin título"}</h1>

                    )}

                    <p className="bg-mariner-50 text-xs p-sm rounded-sm">Guardado localmente</p>

                </div>


                {/* CENTRO */}

                <div className="flex items-center gap-md">

                    <button className="py-sm px-md rounded-md bg-gray-100" onClick={() => router.push("/docs")}>Docs</button>
                    <button className={`py-sm px-md rounded-md ${activeView === "pseudocode" ? "bg-primary text-white" : "bg-gray-100"}`} onClick={() => setActiveView("pseudocode")}>Pseudocódigo</button>
                    <button className={`py-sm px-md rounded-md ${activeView === "flowchart" ? "bg-primary text-white" : "bg-gray-100"}`} onClick={() => setActiveView("flowchart")}>Diagrama</button>
                    <button className={`py-sm px-md rounded-md ${activeView === "code" ? "bg-primary text-white" : "bg-gray-100"}`} onClick={() => setActiveView("code")}>Código</button>

                </div>


                {/* DERECHA */}

                <div className="flex items-center gap-sm">

                    <button
                        className="square center rounded-sm bg-gray-100"
                        style={{ "--square": "40px" }}
                    >
                        <IconReload />
                    </button>

                    <button
                        className="square center rounded-sm bg-gray-100"
                        style={{ "--square": "40px" }}
                    >
                        <IconDeviceFloppy />
                    </button>

                    <button
                        className="square center rounded-sm bg-gray-100"
                        style={{ "--square": "40px" }}
                    >
                        <IconSettings />
                    </button>

                    <button
                        className="h px-md bg-gray-100 rounded-sm flex items-center gap-sm"
                        style={{ "--h": "40px" }}
                    >
                        <IconPlayerPause />
                        Pausar
                    </button>

                    <button
                        className="h px-md bg-primary rounded-sm text-white flex items-center gap-sm"
                        style={{ "--h": "40px" }}
                        onClick={onRun}
                    >
                        <IconPlayerPlay />
                        Run
                    </button>

                </div>

            </div>

        </header>
    );
}