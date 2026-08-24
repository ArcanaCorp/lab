import type { Program, Token } from "../";
import { tokenize } from "./lexer/lexer";
import { parse } from "./parser";

export interface ParseAlgorithmResult {
    source: string;
    tokens: Token[];
    program: Program;
}

export function parseAlgorithm(source: string) : ParseAlgorithmResult {
    
    const tokens = tokenize(source);

    const program = parse(tokens);

    return {
        source,
        tokens,
        program
    };
}