import {
    describe,
    expect,
    it
} from "vitest";

import {
    Execution,
    parse,
    tokenize
} from "../src";

function createProgram(source: string) {
    return parse(
        tokenize(source)
    );
}

describe("Execution Frames", () => {
    it("ejecuta un programa secuencial paso a paso", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            Escribir a

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        execution.start();

        let state = execution.step();

        expect(state.variables.a).toBe(0);

        state = execution.step();

        expect(state.variables.a).toBe(10);

        state = execution.step();

        expect(state.output).toEqual([
            "10"
        ]);

        expect(state.status).toBe("completed");
    });

    it("ejecuta correctamente con run()", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 25

            Escribir a

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        const state = execution.run();

        expect(state.status).toBe("completed");

        expect(state.variables.a).toBe(25);

        expect(state.output).toEqual([
            "25"
        ]);
    });

    it("permite reiniciar el programa", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 25

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        execution.run();

        const state = execution.reset();

        expect(state.status).toBe("idle");

        expect(state.variables).toEqual({});

        expect(state.output).toEqual([]);
    });
});