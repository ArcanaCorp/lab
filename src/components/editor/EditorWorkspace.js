'use client';

import { useState } from "react";
import PseudocodeEditor from "./PseudocodeEditor";
import FlowchartViewer from "./FlowchartViewer";
import CodeViewer from "./CodeViewer";
import BottomPanel from "./BottomPanel";

export default function EditorWorkspace({ algorithm }) {

    const [activeView, setActiveView] = useState("pseudocode");
    const [activePanel, setActivePanel] = useState("terminal");

    const [source, setSource] = useState(
        algorithm.source ?? ""
    );

    const [executionState, setExecutionState] = useState({
        status: "idle",
        currentStatement: 0,
        variables: {},
        output: []
    });

    return (
        <main className="w-full h" style={{"--h": "calc(100dvh - 60px)", overflow: 'hidden'}}>

            <div className="w-full flex" style={{height: "calc(100% - 300px)"}}>

                <div className="w-full h-full">

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

            </div>

            <BottomPanel activePanel={activePanel} setActivePanel={setActivePanel} executionState={executionState} />

        </main>
    );
}