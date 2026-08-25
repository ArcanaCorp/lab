'use client';

import { useEffect, useState } from "react";
import { getAlgorithmBySlug } from "../../../lib/algorithms";
import { analyzeCode } from "../../../lib/algorithm/analyze-code";
import { Execution } from "@lab/algorithm-engine";

import HeaderEditor from "../../../components/HeaderEditor";
import EditorWorkspace from "../../../components/editor/EditorWorkspace";

export default function EditorPage({ params }) {

    const [algorithm, setAlgorithm] = useState(null);

    const [source, setSource] = useState("");

    const [execution, setExecution] = useState(null);

    const [executionState, setExecutionState] = useState({
        status: "idle",
        currentStatement: null,
        variables: {},
        output: []
    });

    useEffect(() => {
        async function load() {
            const { slug } = await params;

            const data = getAlgorithmBySlug(slug);

            setAlgorithm(data);
            setSource(data?.source ?? "");
        }

        load();
    }, [params]);

    if (!algorithm) {
        return <div>Algoritmo no encontrado.</div>;
    }

    function handleRun() {

        console.log("RUN");
        console.log("SOURCE:", source);

        const result = analyzeCode(source);

        console.log("ANALYSIS:", result);

        if (!result.program) {
            console.log("No existe programa");
            return;
        }

        if (
            result.diagnostics.some(
                diagnostic => diagnostic.severity === "error"
            )
        ) {
            console.log("Hay errores de análisis");
            return;
        }

        console.log("Programa válido");

        const newExecution = new Execution(result.program);

        setExecution(newExecution);

        const state = newExecution.run();

        console.log("EXECUTION STATE:", state);

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

    return (
        <>
            <HeaderEditor
                algorithm={algorithm}
                onRun={handleRun}
            />

            <EditorWorkspace
                algorithm={algorithm}
                source={source}
                setSource={setSource}
                executionState={executionState}
                onRun={handleRun}
                onInput={handleInput}
            />
        </>
    );
}