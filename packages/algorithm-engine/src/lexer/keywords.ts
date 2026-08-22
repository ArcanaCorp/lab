import type { TokenType } from "./token";

export const KEYWORDS: Record<string, TokenType> = {
    ALGORITMO: "ALGORITMO",
    FINALGORITMO: "FIN_ALGORITMO",

    DEFINIR: "DEFINIR",
    COMO: "COMO",

    LEER: "LEER",
    ESCRIBIR: "ESCRIBIR",

    SI: "SI",
    ENTONCES: "ENTONCES",
    SINO: "SINO",
    FINSI: "FIN_SI",

    MIENTRAS: "MIENTRAS",
    HACER: "HACER",
    FINMIENTRAS: "FIN_MIENTRAS",

    PARA: "PARA",
    HASTA: "HASTA",
    CON: "CON",
    PASO: "PASO",
    FINPARA: "FIN_PARA",

    ENTERO: "ENTERO",
    REAL: "REAL",
    CARACTER: "CARACTER",
    LOGICO: "LOGICO",

    Y: "AND",
    O: "OR",
    NO: "NOT"
};