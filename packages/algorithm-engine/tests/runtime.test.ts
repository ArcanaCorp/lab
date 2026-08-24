import { describe, expect, it } from "vitest";
import { Runtime, RuntimeError, parse, tokenize } from "../src";

function createProgram(source: string) {
    const tokens = tokenize(source);

    return parse(tokens);
}

describe("Runtime", () => {

    it("ejecuta una asignación simple", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero

            a <- 10

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.a).toBe(10);
        expect(result.output).toEqual([]);
    });

    it("evalúa expresiones aritméticas", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir a Como Entero
            Definir b Como Entero
            Definir resultado Como Entero

            a <- 10
            b <- 20
            resultado <- a + b

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.a).toBe(10);
        expect(result.variables.b).toBe(20);
        expect(result.variables.resultado).toBe(30);
    });

    it("respeta la precedencia de operadores", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir resultado Como Entero

            resultado <- 10 + 5 * 2

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.resultado).toBe(20);
    });

    it("ejecuta Escribir", () => {
        const program = createProgram(`
            Algoritmo Test

            Escribir 10 + 20

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.output).toEqual(["30"]);
    });

    it("ejecuta variables de tipo Caracter", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir nombre Como Caracter

            nombre <- "Franco"

            Escribir nombre

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.nombre).toBe("Franco");
        expect(result.output).toEqual(["Franco"]);
    });

    it("ejecuta concatenación de texto", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir nombre Como Caracter
            Definir mensaje Como Caracter

            nombre <- "Franco"
            mensaje <- "Hola " + nombre

            Escribir mensaje

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.output).toEqual(["Hola Franco"]);
    });

    it("ejecuta una condición Si/Sino", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir edad Como Entero

            edad <- 22

            Si edad >= 18 Entonces
                Escribir "Mayor de edad"
            Sino
                Escribir "Menor de edad"
            FinSi

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.output).toEqual([
            "Mayor de edad"
        ]);
    });

    it("ejecuta un ciclo Mientras", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir contador Como Entero

            contador <- 1

            Mientras contador <= 3 Hacer
                Escribir contador
                contador <- contador + 1
            FinMientras

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.output).toEqual([
            "1",
            "2",
            "3"
        ]);

        expect(result.variables.contador).toBe(4);
    });

    it("ejecuta un ciclo Para", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir suma Como Entero

            suma <- 0

            Para i <- 1 Hasta 5 Hacer
                suma <- suma + i
            FinPara

            Escribir suma

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.output).toEqual([
            "15"
        ]);

        expect(result.variables.suma).toBe(15);
        expect(result.variables.i).toBe(6);
    });

    it("ejecuta operadores lógicos", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir resultado Como Logico

            resultado <- 10 > 5 Y 20 > 10

            Escribir resultado

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.resultado).toBe(true);

        expect(result.output).toEqual([
            "Verdadero"
        ]);
    });

    it("ejecuta negación lógica", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir resultado Como Logico

            resultado <- NO (10 > 20)

            Escribir resultado

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        const result = runtime.execute(program);

        expect(result.variables.resultado).toBe(true);

        expect(result.output).toEqual([
            "Verdadero"
        ]);
    });

    it("lanza error cuando se usa una variable no declarada", () => {
        const program = createProgram(`
            Algoritmo Test

            Escribir x

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        expect(() => {
            runtime.execute(program);
        }).toThrow(RuntimeError);
    });

    it("lanza error al dividir entre cero", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir resultado Como Real

            resultado <- 10 / 0

            FinAlgoritmo
        `);

        const runtime = new Runtime();

        expect(() => {
            runtime.execute(program);
        }).toThrow("No se puede dividir entre cero.");
    });

    it("permite recibir valores mediante input", () => {
        const program = createProgram(`
            Algoritmo Test

            Definir edad Como Entero

            Leer edad

            Escribir edad

            FinAlgoritmo
        `);

        const runtime = new Runtime({
            input: () => 22
        });

        const result = runtime.execute(program);

        expect(result.variables.edad).toBe(22);

        expect(result.output).toEqual([
            "22"
        ]);
    });

});