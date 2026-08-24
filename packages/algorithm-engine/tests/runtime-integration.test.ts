import { describe, expect, it } from "vitest";
import { parseAlgorithm, Runtime } from "../src";

describe("integración parser y runtime", () => {
    it("ejecuta un algoritmo completo con control de flujo", () => {
        const { program } = parseAlgorithm(`Algoritmo Suma
Definir total Como Entero
total <- 0
Para i <- 1 Hasta 3 Hacer
  total <- total + i
FinPara
Si total = 6 Entonces
  Escribir "correcto"
SiNo
  Escribir "incorrecto"
FinSi
FinAlgoritmo`);

        expect(new Runtime().execute(program)).toEqual({
            output: ["correcto"], variables: { total: 6, i: 4 },
        });
    });
});
