import { describe, expect, it } from "vitest";
import { tokenize } from "../src";

describe("Lexer", () => {

    it("tokenizes variable declaration", () => {
        const tokens = tokenize("Definir edad Como Entero");

        expect(tokens.map(token => token.type)).toEqual([
            "DEFINIR",
            "IDENTIFIER",
            "COMO",
            "ENTERO",
            "EOF"
        ]);
    });

    it("tokenizes assignment", () => {
        const tokens = tokenize("edad <- 20");

        expect(tokens.map(token => token.type)).toEqual([
            "IDENTIFIER",
            "ASSIGN",
            "NUMBER",
            "EOF"
        ]);
    });

    it("tokenizes condition", () => {
        const tokens = tokenize("edad >= 18");

        expect(tokens.map(token => token.type)).toEqual([
            "IDENTIFIER",
            "GREATER_EQUAL",
            "NUMBER",
            "EOF"
        ]);
    });

    it("tokenizes strings", () => {
        const tokens = tokenize('Escribir "Hola mundo"');

        expect(tokens.map(token => token.type)).toEqual([
            "ESCRIBIR",
            "STRING",
            "EOF"
        ]);

        expect(tokens[1]?.value).toBe("Hola mundo");
    });

    it("tokenizes a complete small program", () => {
        const source = `
            Algoritmo MayorEdad

                Definir edad Como Entero

                Leer edad

                Si edad >= 18 Entonces
                    Escribir "Mayor de edad"
                SiNo
                    Escribir "Menor de edad"
                FinSi

            FinAlgoritmo
        `;

        const tokens = tokenize(source);

        expect(
            tokens.some(token => token.type === "ALGORITMO")
        ).toBe(true);

        expect(
            tokens.some(token => token.type === "FIN_ALGORITMO")
        ).toBe(true);

        expect(
            tokens.some(token => token.type === "SI")
        ).toBe(true);

        expect(
            tokens.some(token => token.type === "SINO")
        ).toBe(true);

        expect(
            tokens.some(token => token.type === "FIN_SI")
        ).toBe(true);
    });

    it("tokenizes for loop", () => {
        const source = `
            Para i <- 1 Hasta 10 Con Paso 1 Hacer
                Escribir i
            FinPara
        `;

        const tokens = tokenize(source);

        expect(
            tokens
            .filter(token => token.type !== "NEWLINE")
            .map(token => token.type)
        ).toEqual([
            "PARA",
            "IDENTIFIER",
            "ASSIGN",
            "NUMBER",
            "HASTA",
            "NUMBER",
            "CON",
            "PASO",
            "NUMBER",
            "HACER",
            "ESCRIBIR",
            "IDENTIFIER",
            "FIN_PARA",
            "EOF"
        ]);
    });
    
});