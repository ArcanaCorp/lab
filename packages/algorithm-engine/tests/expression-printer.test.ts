import { describe, expect, it } from "vitest";
import { tokenize } from "../src/lexer/lexer";
import { parse } from "../src/parser";
import { expressionToString } from "../src/printer/expression-printer";

describe("Expression Printer", () => {

    function getExpression(source: string) {
        const program = parse(tokenize(`
            Algoritmo Test
                Escribir ${source}
            FinAlgoritmo
        `));

        const statement = program.body[0];

        if (statement.type !== "OutputStatement") {
            throw new Error("Expected OutputStatement");
        }

        return statement.expression;
    }

    it("prints literal", () => {
        const expression = getExpression("10");

        expect(expressionToString(expression)).toBe("10");
    });

    it("prints identifier", () => {
        const expression = getExpression("i");

        expect(expressionToString(expression)).toBe("i");
    });

    it("prints binary expression", () => {
        const expression = getExpression("i + 2");

        expect(expressionToString(expression)).toBe("i + 2");
    });

    it("prints comparison", () => {
        const expression = getExpression("i <= 10");

        expect(expressionToString(expression)).toBe("i <= 10");
    });

    it("prints unary expression", () => {
        const expression = getExpression("-1");

        expect(expressionToString(expression)).toBe("-1");
    });
});