import type { SourceLocation } from "../ast";

export type DiagnosticSeverity =
    | "error"
    | "warning"
    | "info"
;

export interface Diagnostic {
    severity: DiagnosticSeverity;
    code: string;
    message: string;
    location: SourceLocation;
}