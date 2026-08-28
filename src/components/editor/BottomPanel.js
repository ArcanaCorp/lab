'use client'

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { useEditor } from "../../context/EditorContext";

export default function BottomPanel({ activePanel, setActivePanel, executionState, diagnostics = [], onInput }) {

    const { minimized, toogleMinimized } = useEditor();
    const [inputValue, setInputValue] = useState("");

    const handleSendInput = (event) => {
        event.preventDefault();
        if (!inputValue.trim()) return;
        onInput(inputValue);
        setInputValue("");
    }

    return (
        <div className="w-full h" style={{"--h": minimized ? "30px" : "300px"}}>

            <div className="w-full h flex items-center px-md" style={{ "--h": "30px" }}>
                <ul className="w-full h flex items-center gap-sm" style={{ "--h": "30px" }}>
                    <li className={`pointer px-sm rounded-sm text-sm bg-dark-secondary ${activePanel === "terminal" ? "text-primary" : "hover:bg-gray-200"}`} onClick={() => setActivePanel("terminal")}>
                        Terminal
                    </li>
                    <li className={`pointer px-sm rounded-sm text-sm bg-dark-secondary ${activePanel === "errors" ? "text-primary" : "hover:bg-gray-200"}`} onClick={() => setActivePanel("errors")}>
                        Errores {diagnostics.length > 0 && ( <span className="text-xs text-primary rounded-full p-xs">{diagnostics.length}</span> )}
                    </li>
                    <li className={`pointer px-sm rounded-sm text-sm bg-dark-secondary ${activePanel === "console" ? "text-primary" : "hover:bg-gray-200"}`} onClick={() => setActivePanel("console")}>
                        Console
                    </li>
                </ul>
                <button type="button" onClick={toogleMinimized} className="h px-sm bg-dark-secondary text-white rounded-md flex items-center gap-sm" style={{ "--h": "25px" }}>
                    <IconChevronDown size={16} className={`transition-transform ${minimized ? "rotate-180" : ""}`} />
                    {minimized ? "Mostrar" : "Minimizar"}
                </button>
            </div>

            {!minimized && (
                <div className="w-full h bg-dark-secondary p-lg" style={{"--h": "270px", overflowY: "auto"}} role="status" aria-live="polite">

                    {activePanel === "terminal" && (
                        <div className="flex flex-col gap-md">
                            {executionState?.output?.length > 0 ? (
                                executionState.output.map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))
                            ) : (
                                <p className="text-gray-500">Sin salida.</p>
                            )}

                            {executionState?.status === "waiting-input" && (
                                <form onSubmit={(event) => handleSendInput(event)} className="flex items-center gap-sm">
                                    <span>{executionState.inputRequest?.variable}:</span>
                                    <input autoFocus type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} className="px-sm py-md bg-black text-white rounded-md" placeholder="Ingresa un valor" />
                                    <button type="submit" className="btn btn-primary btn-sm">Ingresar</button>
                                </form>
                            )}
                        </div>
                    )}

                    {activePanel === "errors" && (
                        <div>
                            {diagnostics.length === 0 ? (
                                <p className="text-gray text-italic">Sin errores de análisis.</p>
                            ) : (
                                <ul>
                                    {diagnostics.map((diagnostic, index) => (
                                        <li key={`${diagnostic.code}-${index}`}>
                                            {diagnostic.code}:{" "}
                                            {diagnostic.message}
                                            {" "}
                                            (línea{" "}
                                            {diagnostic.location.start.line},
                                            columna{" "}
                                            {diagnostic.location.start.column})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {activePanel === "console" && (
                        <div>
                            <pre>{JSON.stringify(executionState, null, 2)}</pre>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}