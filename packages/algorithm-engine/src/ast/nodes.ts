export type NodeId = string;

export interface SourcePosition {
    line: number;
    column: number;
    offset: number;
}

export interface SourceLocation {
    start: SourcePosition;
    end: SourcePosition;
}

export interface BaseNode {
    id: NodeId;
    location: SourceLocation;
}