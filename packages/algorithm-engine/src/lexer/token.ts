import type { SourceLocation } from "../ast";

export type TokenType =
    // Structure
    | "EOF"
    | "NEWLINE"

    // Keywords
    | "ALGORITMO"
    | "FIN_ALGORITMO"
    | "DEFINIR"
    | "COMO"
    | "LEER"
    | "ESCRIBIR"
    | "SI"
    | "ENTONCES"
    | "SINO"
    | "FIN_SI"
    | "MIENTRAS"
    | "HACER"
    | "FIN_MIENTRAS"
    | "PARA"
    | "HASTA"
    | "FIN_PARA"

    // Types
    | "ENTERO"
    | "REAL"
    | "CARACTER"
    | "LOGICO"

    // Literals
    | "IDENTIFIER"
    | "NUMBER"
    | "STRING"
    | "BOOLEAN"

    // Operators
    | "PLUS"
    | "MINUS"
    | "MULTIPLY"
    | "DIVIDE"
    | "MODULO"

    | "GREATER"
    | "GREATER_EQUAL"
    | "LESS"
    | "LESS_EQUAL"
    | "EQUAL"
    | "NOT_EQUAL"

    | "ASSIGN"

    | "AND"
    | "OR"
    | "NOT"

    // Grouping
    | "LEFT_PAREN"
    | "RIGHT_PAREN"

;

export interface Token {
    type: TokenType;

    lexeme: string;

    value?: string | number | boolean;

    location: SourceLocation;
}