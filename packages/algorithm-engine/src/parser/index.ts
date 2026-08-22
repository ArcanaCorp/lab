import type { Token } from "../lexer/token";
import { Parser } from "./parser";

export function parse(tokens: Token[]) {
    return new Parser(tokens).parse();
}

export * from "./parser";