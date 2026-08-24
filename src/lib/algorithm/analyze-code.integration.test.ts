import { describe, expect, it } from "vitest";
import { analyzeCode } from "./analyze-code";

describe("integración UI y motor de algoritmos", () => {
    it("convierte el contenido válido del editor en un programa sin diagnósticos", () => {
        const result = analyzeCode(`Algoritmo Saludo
Definir nombre Como Caracter
nombre <- "Ada"
Escribir nombre
FinAlgoritmo`);

        expect(result.diagnostics).toEqual([]);
        expect(result.program).toMatchObject({
            type: "Program", name: "Saludo",
            body: [
                { type: "VariableDeclaration", name: "nombre" },
                { type: "Assignment", variable: "nombre" },
                { type: "OutputStatement" },
            ],
        });
    });

    it("devuelve al panel de errores diagnósticos semánticos con ubicación", () => {
        const result = analyzeCode(`Algoritmo ErrorUI
Escribir noDeclarada
FinAlgoritmo`);

        expect(result.program).not.toBeNull();
        expect(result.diagnostics).toMatchObject([{
            severity: "error", code: "E001", location: { start: { line: 2, column: 10 } },
        }]);
    });

    it("impide que una sintaxis inválida llegue al motor como programa", () => {
        const result = analyzeCode("Algoritmo Incompleto");
        expect(result.program).toBeNull();
        expect(result.diagnostics[0]).toMatchObject({ severity: "error", code: "PARSE_ERROR" });
    });
});
