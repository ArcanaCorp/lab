export type FlowchartNodeType =
    | "start"
    | "end"
    | "process"
    | "input"
    | "output"
    | "decision"
    | "merge";

export interface FlowchartNode {
    id: string;

    type: FlowchartNodeType;

    label: string;
}

export interface FlowchartEdge {
    id: string;

    source: string;

    target: string;

    label?: string;
}

export interface Flowchart {
    nodes: FlowchartNode[];

    edges: FlowchartEdge[];
}