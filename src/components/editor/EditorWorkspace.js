'use client';

import { useMemo, useState } from "react";
import { analyzeCode } from "../../lib/algorithm/analyze-code";
import PseudocodeEditor from "./PseudocodeEditor";
import FlowchartViewer from "./FlowchartViewer";
import CodeViewer from "./CodeViewer";
import BottomPanel from "./BottomPanel";

export default function EditorWorkspace({ algorithm, source, setSource, executionState, onInput }) {

    const [activeView, setActiveView] = useState("pseudocode");
    const [activePanel, setActivePanel] = useState("terminal");

    const analysis = useMemo(() => analyzeCode(source), [source]);

    return (
        <main className="w-full h" style={{"--h": "calc(100dvh - 60px)", overflow: 'hidden'}}>

            <div className="w-full flex p-md" style={{height: "calc(100% - 300px)"}}>

                {activeView === "pseudocode" && (
                    <PseudocodeEditor value={source} onChange={setSource} executionState={executionState} />
                )}

                {activeView === "flowchart" && (
                    <FlowchartViewer source={source} executionState={executionState} />
                )}

                {activeView === "code" && (
                    <CodeViewer source={source} />
                )}

            </div>

            <BottomPanel activePanel={activePanel} setActivePanel={setActivePanel} executionState={executionState} onInput={onInput} diagnostics={analysis.diagnostics} />

        </main>
    );
}
