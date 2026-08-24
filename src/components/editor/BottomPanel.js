export default function BottomPanel({
    activePanel,
    setActivePanel,
    executionState,
    diagnostics = []
}) {
    return (
        <div
            className="w-full h"
            style={{ "--h": "300px" }}
        >
            <ul
                className="w-full h flex items-center px-md gap-md text-sm border-y border-solid border-gray"
                style={{ "--h": "30px" }}
            >
                <li
                    className="pointer"
                    onClick={() => setActivePanel("terminal")}
                >
                    Terminal
                </li>

                <li
                    className="pointer"
                    onClick={() => setActivePanel("errors")}
                >
                    Errores
                </li>

                <li
                    className="pointer"
                    onClick={() => setActivePanel("console")}
                >
                    Console
                </li>
            </ul>

            <div
                className="w-full h-full bg-white p-md"
                role="status"
                aria-live="polite"
            >

                {activePanel === "terminal" && (
                    <div>
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
        </div>
    );
}