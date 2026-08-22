import { KEYWORDS } from "./keywords";
import type { Token, TokenType } from "./token";
import type { SourceLocation, SourcePosition } from "../ast";

export function tokenize(source: string): Token[] {
    const tokens: Token[] = [];

    let current = 0;
    let line = 1;
    let column = 1;

    function position(): SourcePosition {
        return {
            line,
            column,
            offset: current
        };
    }

    function advance(): string {
        const char = source[current];

        current++;
        column++;

        return char ?? "";
    }

    function location(start: SourcePosition, end: SourcePosition ) : SourceLocation {
        return {
            start,
            end
        };
    }

    function addToken(type: TokenType, lexeme: string, start: SourcePosition, value?: string | number | boolean) {
        tokens.push({
            type,
            lexeme,
            ...(value !== undefined ? { value } : {}),
            location: location(start, position())
        });
    }

    while (current < source.length) {
        const char = source[current];

        if (char === " " || char === "\t" || char === "\r") {
            advance();
            continue;
        }

        if (char === "\n") {
            const start = position();

            advance();

            tokens.push({
                type: "NEWLINE",
                lexeme: "\\n",
                location: location(start, position())
            });

            line++;
            column = 1;

            continue;
        }

        const start = position();

        // Identifiers / keywords
        if (/[A-Za-z_]/.test(char)) {
            let value = "";

            while (current < source.length && /[A-Za-z0-9_]/.test(source[current])) {
                value += advance();
            }

            const normalized = value.toUpperCase();

            const keyword = KEYWORDS[normalized];

            if (keyword) {
                addToken(keyword, value, start);
            } else {
                addToken("IDENTIFIER", value, start);
            }

            continue;
        }

        // Numbers
        if (/[0-9]/.test(char)) {
            let value = "";

            while (current < source.length && /[0-9]/.test(source[current])) {
                value += advance();
            }

            if (source[current] === ".") {
                value += advance();

                while (current < source.length && /[0-9]/.test(source[current])) {
                value += advance();
                }
            }

            addToken("NUMBER", value, start, Number(value));

            continue;
        }

        // Strings
        if (char === '"') {
            advance();

            let value = "";

            while (current < source.length && source[current] !== '"') {
                value += advance();
            }

            if (current < source.length) {
                advance();
            }

            addToken( "STRING", value, start, value);

            continue;
        }

        // Operators
        switch (char) {
            case "+":
                advance();
                addToken("PLUS", char, start);
                break;

            case "-":
                advance();
                addToken("MINUS", char, start);
                break;

            case "*":
                advance();
                addToken("MULTIPLY", char, start);
                break;

            case "/":
                advance();
                addToken("DIVIDE", char, start);
                break;

            case "%":
                advance();
                addToken("MODULO", char, start);
                break;

            case "(":
                advance();
                addToken("LEFT_PAREN", char, start);
                break;

            case ")":
                advance();
                addToken("RIGHT_PAREN", char, start);
                break;

            case "<":
                advance();

                if (source[current] === "=") {
                    advance();
                    addToken("LESS_EQUAL", "<=", start);
                } else if (source[current] === ">") {
                    advance();
                    addToken("NOT_EQUAL", "<>", start);
                } else if (source[current] === "-") {
                    advance();
                    addToken("ASSIGN", "<-", start);
                } else {
                    addToken("LESS", "<", start);
                }

                break;

            case ">":
                advance();

                if (source[current] === "=") {
                    advance();
                    addToken("GREATER_EQUAL", ">=", start);
                } else {
                    addToken("GREATER", ">", start);
                }

                break;

            case "=":
                advance();
                addToken("EQUAL", "=", start);
                break;

            default: throw new Error(`Unexpected character '${char}' at ${line}:${column}`);
        }
    }

    tokens.push({
        type: "EOF",
        lexeme: "",
        location: {
            start: position(),
            end: position()
        }
    });

    return tokens;
}