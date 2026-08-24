import { tokenize, parse, analyze, type Program, type Diagnostic } from "@lab/algorithm-engine";

export interface CodeAnalysis {
    program: Program | null;
    diagnostics: Diagnostic[];
}

export function analyzeCode(source: string): CodeAnalysis {
    if (!source.trim()) {
        return {
            program: null,
            diagnostics: [],
        };
    }

    try {
        const tokens = tokenize(source);
        const program = parse(tokens);
        const diagnostics = analyze(program);

        return {
            program,
            diagnostics,
        };
    } catch (error) {
        return {
            program: null,
            diagnostics: [
                {
                    severity: "error",
                    code: "PARSE_ERROR",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido al analizar el código.",
                    location: {
                        start: {
                            line: 1,
                            column: 1,
                            offset: 0,
                        },
                        end: {
                            line: 1,
                            column: 1,
                            offset: 0,
                        },
                    },
                },
            ],
        };
    }
}