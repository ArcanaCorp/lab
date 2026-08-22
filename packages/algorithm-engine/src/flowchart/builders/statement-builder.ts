import type { FlowchartEdge, FlowchartNode } from "../model";
import type { Statement } from "../../ast";

export interface FlowchartBuilderContext {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];

    addNode(
        type: FlowchartNode["type"],
        label: string
    ): string;

    connect(
        source: string,
        target: string,
        label?: string
    ): void;
}


export interface FlowchartFragment {
    entry: string;
    exit: string;
}

export type StatementBuilder = (
    statement: Statement,
    context: FlowchartBuilderContext
) => FlowchartFragment;