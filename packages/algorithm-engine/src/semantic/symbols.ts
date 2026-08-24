import type { PrimitiveType } from "../ast/types";

export interface Symbol {
    name: string;
    dataType: PrimitiveType;
    location: {
        start: {
            line: number;
            column: number;
        };
        end: {
            line: number;
            column: number;
        };
    };
}

export class SymbolTable {
    private symbols = new Map<string, Symbol>();

    define(symbol: Symbol): boolean {
        if (this.symbols.has(symbol.name)) {
            return false;
        }

        this.symbols.set(symbol.name, symbol);

        return true;
    }

    resolve(name: string): Symbol | undefined {
        return this.symbols.get(name);
    }

    has(name: string): boolean {
        return this.symbols.has(name);
    }
}