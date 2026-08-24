import { describe, expect, it } from "vitest";
import { Execution, parse, tokenize } from "../src";

function createProgram(source: string) {
    return parse(
        tokenize(source)
    );
}

describe("Execution", () => {
    
    it("inicia una ejecución en estado pausado", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        const state = execution.start();

        expect(state.status).toBe("paused");

        expect(state.currentStatement).toBe(0);

        expect(state.variables).toEqual({});

        expect(state.output).toEqual([]);
    });

    it("ejecuta una instrucción por step", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        execution.start();

        const state = execution.step();

        expect(state.variables.a).toBe(0);
    });

    it("ejecuta varias instrucciones paso a paso", () => {
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
    });

    it("marca la ejecución como completada", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        const state = execution.run();

        expect(state.status).toBe("completed");

        expect(state.variables.a).toBe(10);
    });

    it("puede reiniciar una ejecución", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        execution.run();

        const state = execution.reset();

        expect(state.status).toBe("idle");

        expect(state.currentStatement).toBe(0);

        expect(state.variables).toEqual({});

        expect(state.output).toEqual([]);
    });

    it("no avanza después de completar", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const execution = new Execution(program);

        execution.run();

        const firstState = execution.getState();

        const secondState = execution.step();

        expect(secondState).toEqual(firstState);
    });

});