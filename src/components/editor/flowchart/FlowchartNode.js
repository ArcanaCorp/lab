"use client";

import { Handle, Position } from "@xyflow/react";

export default function FlowchartNode({ data }) {

    return (
        <div className="flowchart-node-content">

            <Handle
                type="target"
                position={Position.Top}
            />

            <div>
                {data.label}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
            />

        </div>
    );
}