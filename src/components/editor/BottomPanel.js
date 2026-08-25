'use client'

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { useEditor } from "../../context/EditorContext";

export default function BottomPanel({
    activePanel,
    setActivePanel,
    executionState,
    diagnostics = [],
    onInput
}) {

    const { minimized, toogleMinimized } = useEditor();
    const [inputValue, setInputValue] = useState("");

    return (
        <div
            className="w-full h"
            style={{
                "--h": minimized ? "30px" : "300px"
            }}
        >

            {/* Header */}

            <div
                className="w-full h flex items-center border-y border-solid border-gray px-md"
                style={{ "--h": "30px" }}
            >

                <ul
                    className="w-full h flex items-center"
                    style={{ "--h": "30px" }}
                >

                    <li
                        className={`pointer px-sm rounded-sm ${
                            activePanel === "terminal"
                                ? "bg-mariner-500 text-white"
                                : "hover:bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("terminal")}
                    >
                        Terminal
                    </li>

                    <li
                        className={`pointer px-sm rounded-sm ${
                            activePanel === "errors"
                                ? "bg-mariner-500 text-white"
                                : "hover:bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("errors")}
                    >
                        Errores
                    </li>

                    <li
                        className={`pointer px-sm rounded-sm ${
                            activePanel === "console"
                                ? "bg-mariner-500 text-white"
                                : "hover:bg-gray-200"
                        }`}
                        onClick={() => setActivePanel("console")}
                    >
                        Console
                    </li>

                </ul>

                <button
                    type="button"
                    onClick={toogleMinimized}
                    className="h px-sm bg-gray-200 rounded-md flex items-center gap-sm"
                    style={{ "--h": "25px" }}
                >
                    <IconChevronDown
                        size={16}
                        className={`transition-transform ${
                            minimized ? "rotate-180" : ""
                        }`}
                    />

                    {minimized ? "Mostrar" : "Minimizar"}
                </button>

            </div>


            {/* Contenido */}

            {!minimized && (
                <div
                    className="w-full h bg-white p-md"
                    style={{
                        "--h": "270px",
                        overflowY: "auto"
                    }}
                    role="status"
                    aria-live="polite"
                >

                    {activePanel === "terminal" && (
                        <div className="flex flex-col gap-md">

                            {executionState?.output?.length > 0 ? (
                                executionState.output.map((line, index) => (
                                    <div key={index}>
                                        {line}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Sin salida.
                                </p>
                            )}

                            {executionState?.status === "waiting-input" && (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();

                                        if (!inputValue.trim()) {
                                            return;
                                        }

                                        onInput(inputValue);

                                        setInputValue("");
                                    }}
                                    className="flex items-center gap-sm"
                                >

                                    <span>
                                        {executionState.inputRequest?.variable}:
                                    </span>

                                    <input
                                        autoFocus
                                        type="text"
                                        value={inputValue}
                                        onChange={(event) =>
                                            setInputValue(event.target.value)
                                        }
                                        className="border border-solid border-gray px-sm"
                                        placeholder="Ingresa un valor"
                                    />

                                    <button
                                        type="submit"
                                        className="px-md bg-primary text-white rounded-sm"
                                    >
                                        Ingresar
                                    </button>

                                </form>
                            )}

                        </div>
                    )}


                    {activePanel === "errors" && (
                        <div>

                            {diagnostics.length === 0 ? (
                                <p className="text-gray-500">
                                    Sin errores de análisis.
                                </p>
                            ) : (
                                <ul>

                                    {diagnostics.map((diagnostic, index) => (
                                        <li
                                            key={`${diagnostic.code}-${index}`}
                                        >
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

                            <pre>
                                {JSON.stringify(
                                    executionState,
                                    null,
                                    2
                                )}
                            </pre>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}