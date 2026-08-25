"use client";

import { Handle, Position } from "@xyflow/react";

export default function DecisionNode({ data }) {

    return (
        <div className="decision-node-wrapper">

            <Handle
                type="target"
                position={Position.Top}
            />

            <div className="decision-node">
                <span>
                    {data.label}
                </span>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
            />

            <Handle
                type="source"
                position={Position.Left}
                id="no"
            />

            <Handle
                type="source"
                position={Position.Right}
                id="yes"
            />

        </div>
    );
}