import type { Program, Statement, Token, TokenType, SourceLocation, Expression, BinaryOperator, PrimitiveType } from "../";

export class Parser {
    private current = 0;

    constructor(
        private readonly tokens: Token[]
    ) {}

    parse(): Program {
        this.skipNewlines();

        const start = this.peek().location.start;

        this.consume("ALGORITMO", "Se esperaba 'Algoritmo'.");

        const name = this.consume("IDENTIFIER", "Se esperaba el nombre del algoritmo.");

        this.skipNewlines();

        const body: Statement[] = [];

        while (!this.check("FIN_ALGORITMO") && !this.isAtEnd()) {
            this.skipNewlines();

            if (this.check("FIN_ALGORITMO") || this.isAtEnd()) {
                break;
            }

            body.push(this.statement());
            this.skipNewlines();
        }

        const end = this.consume("FIN_ALGORITMO", "Se esperaba 'FinAlgoritmo'.");

        return {
            type: "Program",
            id: "program",
            name: name.lexeme,
            location: {
                start,
                end: end.location.end
            },
            body
        };
    }

    private expression(): Expression {
        return this.parseBinaryExpression(0);
    }

    private statement(): Statement {
        if (this.match("DEFINIR")) {
            return this.variableDeclaration();
        }

        if (this.match("LEER")) {
            return this.inputStatement();
        }

        if (this.match("ESCRIBIR")) {
            return this.outputStatement();
        }

        if (this.match("SI")) {
            return this.ifStatement();
        }

        if (this.match("MIENTRAS")) {
            return this.whileStatement();
        }

        if (this.match("PARA")) {
            return this.forStatement();
        }

        if (this.check("IDENTIFIER")) {
            return this.assignment();
        }

        throw this.error(
            this.peek(),
            `Sentencia inesperada '${this.peek().lexeme}'.`
        );
    }

    private assignment(): Statement {
        
        const variable = this.consume("IDENTIFIER", "Se esperaba una variable.");

        this.consume("ASSIGN", "Se esperaba '<-' después de la variable.");

        const value = this.expression();

        return {
            type: "Assignment",
            id: `assignment_${this.current}`,
            variable: variable.lexeme,
            value,
            location: {
                start: variable.location.start,
                end: value.location.end
            }
        };
    }

    private variableDeclaration(): Statement {
        
        const name = this.consume("IDENTIFIER", "Se esperaba el nombre de la variable." );

        this.consume("COMO", "Se esperaba 'Como'.");

        const type = this.advance();

        const validTypes: TokenType[] = [
            "ENTERO",
            "REAL",
            "CARACTER",
            "LOGICO"
        ];

        if (!validTypes.includes(type.type)) {
            throw this.error(
                type,
                "Se esperaba un tipo de dato."
            );
        }

        return {
            type: "VariableDeclaration",
            id: `variable_${name.lexeme}`,
            name: name.lexeme,
            dataType: this.mapType(type.type),
            location: {
                start: name.location.start,
                end: type.location.end
            }
        };
    }

    private inputStatement(): Statement {
        const variable = this.consume(
            "IDENTIFIER",
            "Se esperaba una variable después de 'Leer'."
        );

        return {
            type: "InputStatement",
            id: `input_${variable.lexeme}_${this.current}`,
            variable: variable.lexeme,
            location: {
                start: variable.location.start,
                end: variable.location.end
            }
        };
    }

    private outputStatement(): Statement {
        const expression = this.expression();

        return {
            type: "OutputStatement",
            id: `output_${this.current}`,
            expression,
            location: expression.location
        };
    }

    private ifStatement(): Statement {
        const start = this.previous().location.start;

        const condition = this.expression();

        this.consume("ENTONCES", "Se esperaba 'Entonces' después de la condición.");

        this.skipNewlines();

        const thenBranch: Statement[] = [];

        while (!this.check("SINO") && !this.check("FIN_SI") && !this.isAtEnd()) {
            this.skipNewlines();

            if (this.check("SINO") || this.check("FIN_SI") || this.isAtEnd()) {
            break;
            }

            thenBranch.push(this.statement());

            this.skipNewlines();
        }

        let elseBranch: Statement[] = [];

        if (this.match("SINO")) {
            this.skipNewlines();

            elseBranch = [];

            while (!this.check("FIN_SI") && !this.isAtEnd()) {
                this.skipNewlines();

                if (this.check("FIN_SI") || this.isAtEnd()) {
                    break;
                }

                elseBranch.push(this.statement());

                this.skipNewlines();
            }
        }

        const end = this.consume("FIN_SI", "Se esperaba 'FinSi'.");

        return {
            type: "IfStatement",
            id: `if_${this.current}`,
            condition,
            thenBranch,
            elseBranch,
            location: {
                start,
                end: end.location.end
            }
        };
    }

    private whileStatement(): Statement {
        const start = this.previous().location.start;

        const condition = this.expression();

        this.consume("HACER","Se esperaba 'Hacer' después de la condición.");

        this.skipNewlines();

        const body: Statement[] = [];

        while (!this.check("FIN_MIENTRAS") && !this.isAtEnd()) {
            this.skipNewlines();

            if (this.check("FIN_MIENTRAS") || this.isAtEnd()) {
                break;
            }

            body.push(this.statement());

            this.skipNewlines();
        }

        const end = this.consume("FIN_MIENTRAS", "Se esperaba 'FinMientras'.");

        return {
            type: "WhileStatement",
            id: `while_${this.current}`,
            condition,
            body,
            location: {
                start,
                end: end.location.end
            }
        };
    }

    private forStatement(): Statement {
        const start = this.previous().location.start;

        const variable = this.consume(
            "IDENTIFIER",
            "Se esperaba una variable después de 'Para'."
        );

        this.consume(
            "ASSIGN",
            "Se esperaba '<-' después de la variable."
        );

        const startExpression = this.expression();

        this.consume(
            "HASTA",
            "Se esperaba 'Hasta' después de la expresión inicial."
        );

        const endExpression = this.expression();

        let stepExpression: Expression;

        if (this.match("CON")) {
            this.consume(
                "PASO",
                "Se esperaba 'Paso' después de 'Con'."
            );

            stepExpression = this.expression();
        } else {
            stepExpression = {
                type: "LiteralExpression",
                id: `literal_${this.current}`,
                value: 1,
                dataType: "Integer",
                location: {
                    start: endExpression.location.end,
                    end: endExpression.location.end
                }
            };
        }

        this.consume(
            "HACER",
            "Se esperaba 'Hacer' después de la configuración del ciclo."
        );

        this.skipNewlines();

        const body: Statement[] = [];

        while (!this.check("FIN_PARA") && !this.isAtEnd()) {
            this.skipNewlines();

            if (this.check("FIN_PARA") || this.isAtEnd()) {
                break;
            }

            body.push(this.statement());

            this.skipNewlines();
        }

        const end = this.consume(
            "FIN_PARA",
            "Se esperaba 'FinPara'."
        );

        return {
            type: "ForStatement",
            id: `for_${this.current}`,
            variable: variable.lexeme,
            start: startExpression,
            end: endExpression,
            step: stepExpression,
            body,
            location: {
                start,
                end: end.location.end
            }
        };
    }

    private getPrecedence(type: TokenType) : number {
        switch (type) {
            case "OR":
                return 1;

            case "AND":
                return 2;

            case "EQUAL":
            case "NOT_EQUAL":
            case "GREATER":
            case "GREATER_EQUAL":
            case "LESS":
            case "LESS_EQUAL":
                return 3;

            case "PLUS":
            case "MINUS":
                return 4;

            case "MULTIPLY":
            case "DIVIDE":
            case "MODULO":
                return 5;

            default:
                return -1;
        }
    }

    private parseBinaryExpression(minimumPrecedence: number) : Expression {
        
        let left = this.unary();
        
        while (true) {
            const operator = this.peek();

            const precedence = this.getPrecedence(operator.type);

            if (precedence < minimumPrecedence) {
                break;
            }

            this.advance();

            const right = this.parseBinaryExpression(precedence + 1);

            left = {
                type: "BinaryExpression",
                id: `binary_${this.current}`,
                operator: this.mapBinaryOperator(operator.type),
                left,
                right,
                location: {
                    start: left.location.start,
                    end: right.location.end
                }
            };
        }
        
        return left;
    
    }

    private unary(): Expression {
        if (this.match("MINUS", "NOT")) {
            const operator = this.previous();

            const operand = this.unary();

            return {
                type: "UnaryExpression",
                id: `unary_${this.current}`,
                operator:
                    operator.type === "MINUS"
                    ? "-"
                    : "NO",
                operand,
                location: {
                    start: operator.location.start,
                    end: operand.location.end
                }
            };
        }

        return this.primary();
    }

    private primary(): Expression {

        if (this.match("NUMBER")) {
            const token = this.previous();

            const value = token.value as number;

            return {
                type: "LiteralExpression",
                id: `literal_${this.current}`,
                value,
                dataType: Number.isInteger(value)
                    ? "Integer"
                    : "Real",
                location: token.location
            };
        }

        if (this.match("STRING")) {
            const token = this.previous();

            return {
                type: "LiteralExpression",
                id: `literal_${this.current}`,
                value: token.value as string,
                dataType: "Caracter",
                location: token.location
            };
        }

        if (this.match("IDENTIFIER")) {
            const token = this.previous();

            return {
                type: "IdentifierExpression",
                id: `identifier_${this.current}`,
                name: token.lexeme,
                location: token.location
            };
        }

        if (this.match("LEFT_PAREN")) {
            const expression = this.expression();
            this.consume("RIGHT_PAREN", "Se esperaba ')'.");
            return expression;
        }

        throw this.error( this.peek(), `Se esperaba una expresión, pero se encontró '${this.peek().lexeme}'.`);
    }

    private mapType( type: TokenType ) : PrimitiveType {
        switch (type) {
            case "ENTERO":
                return "Integer";

            case "REAL":
                return "Real";

            case "CARACTER":
                return "Caracter";

            case "LOGICO":
                return "Logico";

            default:
                throw new Error(`Invalid type: ${type}`);
        }
    }

    private mapBinaryOperator(type: TokenType) : BinaryOperator {
        switch (type) {
            case "PLUS":
                return "+";

            case "MINUS":
                return "-";

            case "MULTIPLY":
                return "*";

            case "DIVIDE":
                return "/";

            case "MODULO":
                return "%";

            case "GREATER":
                return ">";

            case "GREATER_EQUAL":
                return ">=";

            case "LESS":
                return "<";

            case "LESS_EQUAL":
                return "<=";

            case "EQUAL":
                return "=";

            case "NOT_EQUAL":
                return "<>";

            case "AND":
                return "Y";

            case "OR":
                return "O";

            default:
                throw new Error(`Token '${type}' no es un operador binario.`);
        }
    }

    private skipNewlines(): void {
        while (this.match("NEWLINE")) {}
    }

    private consume(type: TokenType, message: string) : Token {
        if (this.check(type)) {
            return this.advance();
        }

        throw this.error(
            this.peek(),
            message
        );
    }

    private check(type: TokenType): boolean {
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
        this.current++;
        }

        return this.previous();
    }

    private previous(): Token {
        return this.tokens[this.current - 1]!;
    }

    private peek(): Token {
        return this.tokens[this.current]!;
    }

    private isAtEnd(): boolean {
        return this.peek().type === "EOF";
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
        if (this.check(type)) {
            this.advance();
            return true;
        }
        }

        return false;
    }

    private error(token: Token, message: string) : Error {
        return new Error(
            `${message} Línea ${token.location.start.line}, columna ${token.location.start.column}.`
        );
    }
}