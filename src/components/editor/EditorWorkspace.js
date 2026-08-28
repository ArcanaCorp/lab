'use client';

import { useMemo, useState } from "react";
import { analyzeCode } from "../../lib/algorithm/analyze-code";
import PseudocodeEditor from "./PseudocodeEditor";
import FlowchartViewer from "./FlowchartViewer";
import CodeViewer from "./CodeViewer";
import BottomPanel from "./BottomPanel";
import { useEditor } from "../../context/EditorContext";
import { buildFlowchart } from "../../../packages/algorithm-engine";

export default function EditorWorkspace({ source, setSource, executionState, onInput }) {

    const { activeView, activePanel, setActivePanel, minimized } = useEditor();

    const analysis = useMemo(() => analyzeCode(source), [source]);

    const flowchart = useMemo(() => {

        if (!analysis.program) return null;

        if (analysis.diagnostics.some(diagnostic => diagnostic.severity === "error")) return null;

        return buildFlowchart(analysis.program);

    }, [analysis]);

    return (
        <main className="w-full h" style={{"--h": "calc(100dvh - 60px)", overflow: 'hidden'}}>

            <div className="w-full flex p-md" style={{height: `calc(100% - ${minimized ? '30px' : '300px'})`}}>

                {activeView === "pseudocode" && (
                    <PseudocodeEditor value={source} onChange={setSource} executionState={executionState} />
                )}

                {activeView === "flowchart" && (
                    <FlowchartViewer flowchart={flowchart} executionState={executionState} />
                )}

                {activeView === "code" && (
                    <CodeViewer program={analysis.program} />
                )}

            </div>

            <BottomPanel activePanel={activePanel} setActivePanel={setActivePanel} executionState={executionState} onInput={onInput} diagnostics={analysis.diagnostics} />

        </main>
    );
}
