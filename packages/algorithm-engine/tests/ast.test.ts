import { describe, expect, it } from "vitest";

import type { Program, SourceLocation } from "../src";

const location: SourceLocation = {
    start: {
        line: 1,
        column: 1,
        offset: 0
    },
    end: {
        line: 1,
        column: 1,
        offset: 0
    }
};

describe("AST", () => {
    it("can represent a program", () => {
        const program: Program = {
        id: "program-1",
        type: "Program",
        name: "MayorEdad",
        location,
        body: []
        };

        expect(program.type).toBe("Program");
        expect(program.name).toBe("MayorEdad");
    });
});