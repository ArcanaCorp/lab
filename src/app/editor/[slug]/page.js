'use client';

import { useEffect, useState } from "react";
import { analyzeCode } from "../../../lib/algorithm/analyze-code";
import { Execution } from "@lab/algorithm-engine";

import HeaderEditor from "../../../components/HeaderEditor";
import EditorWorkspace from "../../../components/editor/EditorWorkspace";
import { useEditor } from "../../../context/EditorContext";

export default function EditorPage({ params }) {

    const { algorithm, loading, updateSource, activeView, setActiveView } = useEditor();

    console.log(algorithm);

    const [source, setSource] = useState("");

    const [execution, setExecution] = useState(null);

    const [executionState, setExecutionState] = useState({
        status: "idle",
        currentStatement: null,
        variables: {},
        output: []
    });


    function handleRun() {

        const result = analyzeCode(source);

        if (!result.program) {
            console.log("No existe programa");
            return;
        }

        if (result.diagnostics.some(diagnostic => diagnostic.severity === "error")) return console.log("Hay errores de análisis");

        const newExecution = new Execution(result.program);

        setExecution(newExecution);

        const state = newExecution.run();

        setExecutionState(state);
    }

    function handleInput(value) {
        if (!execution) {
            return;
        }

        const state = execution.provideInput(value);

        setExecutionState(state);

        const finalState = execution.run();

        setExecutionState(finalState);
    }

    const handleSourceChange = (newSource) => {
        setSource(newSource);
        updateSource(newSource);
    }

    useEffect(() => {

        if (!algorithm) return;

        setSource(algorithm.source ?? "");

    }, [algorithm]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!algorithm) {
        return <div>Algoritmo no encontrado.</div>;
    }

    return (
        <>
            <HeaderEditor
                algorithm={algorithm}
                activeView={activeView}
                setActiveView={setActiveView}
                onRun={handleRun}
            />

            <EditorWorkspace
                algorithm={algorithm}
                source={source}
                setSource={handleSourceChange}
                executionState={executionState}
                onRun={handleRun}
                onInput={handleInput}
            />
        </>
    );
}