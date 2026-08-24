import { tokenize, parse, analyze, type Program, type Diagnostic } from "@lab/algorithm-engine";

export interface CodeAnalysis {
    tokens: ReturnType<typeof tokenize>;
    program: Program | null;
    diagnostics: Diagnostic[];
}

export function analyzeCode(source: string): CodeAnalysis {
    if (!source.trim()) {
        return {
            tokens: [],
            program: null,
            diagnostics: [],
        };
    }

    try {
        const tokens = tokenize(source);
        const program = parse(tokens);
        const diagnostics = analyze(program);

        return {
            tokens,
            program,
            diagnostics,
        };

    } catch (error) {
        return {
            tokens: [],
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