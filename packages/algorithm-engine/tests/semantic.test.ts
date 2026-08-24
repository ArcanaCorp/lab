import { describe, expect, it } from "vitest";
import { tokenize } from "../src/lexer/lexer";
import { parse } from "../src/parser";
import { analyze } from "../src/semantic";

function parseProgram(source: string) {
    return parse(tokenize(source));
}

describe("Semantic Analyzer", () => {

    it("accepts a declared variable", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Definir edad Como Entero
                edad <- 20

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toEqual([]);
    });

    it("reports an undeclared variable", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Escribir nombre

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toHaveLength(1);

        expect(diagnostics[0]).toMatchObject({
            severity: "error",
            code: "E001"
        });
    });

    it("reports duplicate declarations", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Definir edad Como Entero
                Definir edad Como Real

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toHaveLength(1);

        expect(diagnostics[0]).toMatchObject({
            severity: "error",
            code: "E002"
        });
    });

    it("reports an undeclared variable inside an if condition", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Definir edad Como Entero

                Si limite > edad Entonces
                    Escribir edad
                FinSi

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toHaveLength(1);

        expect(diagnostics[0]).toMatchObject({
            severity: "error",
            code: "E001"
        });
    });

    it("reports an undeclared variable inside while condition", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Mientras contador < limite Hacer
                    Escribir contador
                FinMientras

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toHaveLength(2);

        expect(diagnostics.every(d => d.code === "E001")).toBe(true);
    });

    it("reports an undeclared variable inside if body", () => {
        const program = parseProgram(`
            Algoritmo Prueba

                Definir edad Como Entero

                Si edad > 18 Entonces
                    Escribir nombre
                FinSi

            FinAlgoritmo
        `);

        const diagnostics = analyze(program);

        expect(diagnostics).toHaveLength(1);

        expect(diagnostics[0]).toMatchObject({
            severity: "error",
            code: "E001"
        });
    });

});