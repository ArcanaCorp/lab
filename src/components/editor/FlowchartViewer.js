"use client";

import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import { flowchartToReactFlow } from "./flowchart-adapter";

import "@xyflow/react/dist/style.css";

export default function FlowchartViewer({ flowchart }) {

    console.log("FLOWCHART:", flowchart);

    if (!flowchart) {
        return (
            <div className="w-full h-full center">
                <p>No hay diagrama disponible.</p>
            </div>
        );
    }

    const { nodes, edges } = flowchartToReactFlow(flowchart);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}