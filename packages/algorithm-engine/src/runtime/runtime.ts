import type { Program, Statement, Expression } from "../ast";

import type { BinaryOperator, UnaryOperator } from "../ast/expressions";

import type { Assignment, ForStatement, IfStatement, InputStatement, OutputStatement, VariableDeclaration, WhileStatement } from "../ast/statements";

import { Environment } from "./environment";
import { RuntimeError } from "./runtime-error";
import type { RuntimeValue } from "./value";

export interface RuntimeOptions {
    input?: (variable: string) => RuntimeValue | Promise<RuntimeValue>;
    preserveState?: boolean;
}

export interface RuntimeResult {
    output: string[];
    variables: Record<string, RuntimeValue>;
}

export class Runtime {

    private readonly environment: Environment;
    private readonly output: string[];
    private readonly input: RuntimeOptions["input"];
    private readonly preserveState: boolean;

    constructor(options: RuntimeOptions = {}, environment: Environment = new Environment(), output: string[] = []) {
        this.environment = environment;
        this.output = output;
        this.input = options.input;
        this.preserveState = options.preserveState ?? false;
    }

    execute(program: Program): RuntimeResult {
        if (!this.preserveState) {
            this.environment.clear();
            this.output.length = 0;
        }

        for (const statement of program.body) {
            this.executeStatementInternal(statement);
        }

        return {
            output: [...this.output],
            variables: this.environment.snapshot()
        };
    }

    executeStatement(statement: Statement): void {
        this.executeStatementInternal(statement);
    }

    private executeStatementInternal(statement: Statement) : void {
        switch (statement.type) {
            case "VariableDeclaration":
                this.executeVariableDeclaration(statement);
                break;

            case "Assignment":
                this.executeAssignment(statement);
                break;

            case "InputStatement":
                this.executeInput(statement);
                break;

            case "OutputStatement":
                this.executeOutput(statement);
                break;

            case "IfStatement":
                this.executeIf(statement);
                break;

            case "WhileStatement":
                this.executeWhile(statement);
                break;

            case "ForStatement":
                this.executeFor(statement);
                break;

            default:
                throw new RuntimeError(`Sentencia no soportada: ${String(statement)}`);
        }
    }

    private executeVariableDeclaration(
        statement: VariableDeclaration
    ) : void {
        this.environment.define(
            statement.name,
            this.defaultValue(statement.dataType),
            statement.dataType
        );
    }

    private executeAssignment(statement: Assignment): void {
        const value = this.evaluateExpression(statement.value);

        this.environment.set(
            statement.variable,
            value
        );
    }

    private async executeInputAsync(statement: InputStatement) : Promise<void> {
        
        if (!this.input) {
            throw new RuntimeError(
                `No existe un proveedor de entrada para la variable '${statement.variable}'.`,
                statement.location.start.line,
                statement.location.start.column
            );
        }

        const value = await this.input(statement.variable);

        this.environment.set(
            statement.variable,
            value
        );
    }

    private executeInput(statement: InputStatement): void {
        if (!this.input) {
            throw new RuntimeError(
                `No existe un proveedor de entrada para la variable '${statement.variable}'.`,
                statement.location.start.line,
                statement.location.start.column
            );
        }

        const result = this.input(statement.variable);

        if (result instanceof Promise) {
            throw new RuntimeError(
                "El proveedor de entrada es asíncrono. Utiliza executeAsync().",
                statement.location.start.line,
                statement.location.start.column
            );
        }

        this.environment.set(
            statement.variable,
            result
        );
    }

    private executeOutput(statement: OutputStatement): void {
        const value = this.evaluateExpression(statement.expression);

        this.output.push(
            this.stringify(value)
        );
    }

    private executeIf(statement: IfStatement): void {
        const condition = this.evaluateExpression(
            statement.condition
        );

        if (this.isTruthy(condition)) {
            this.executeStatements(statement.thenBranch);
        } else {
            this.executeStatements(statement.elseBranch);
        }
    }

    private executeWhile(statement: WhileStatement): void {
        while (
            this.isTruthy(
                this.evaluateExpression(statement.condition)
            )
        ) {
            this.executeStatements(statement.body);
        }
    }

    private executeFor(statement: ForStatement): void {
        const start = this.requireNumber(
            this.evaluateExpression(statement.start),
            statement
        );

        const end = this.requireNumber(
            this.evaluateExpression(statement.end),
            statement
        );

        const step = this.requireNumber(
            this.evaluateExpression(statement.step),
            statement
        );

        if (step === 0) {
            throw new RuntimeError(
                "El paso de un ciclo Para no puede ser 0.",
                statement.location.start.line,
                statement.location.start.column
            );
        }

        if (!this.environment.has(statement.variable)) {
            this.environment.define(
                statement.variable,
                start,
                "Integer"
            );
        } else {
            this.environment.set(
                statement.variable,
                start
            );
        }

        if (step > 0) {
            while (
                (this.environment.get(statement.variable) as number) <= end
            ) {
                this.executeStatements(statement.body);

                const current = this.requireNumber(
                    this.environment.get(statement.variable),
                    statement
                );

                this.environment.set(
                    statement.variable,
                    current + step
                );
            }
        } else {
            while (
                (this.environment.get(statement.variable) as number) >= end
            ) {
                this.executeStatements(statement.body);

                const current = this.requireNumber(
                    this.environment.get(statement.variable),
                    statement
                );

                this.environment.set(
                    statement.variable,
                    current + step
                );
            }
        }
    }

    private executeStatements(statements: Statement[]): void {
        for (const statement of statements) {
            this.executeStatementInternal(statement);
        }
    }

    private evaluateExpression(expression: Expression): RuntimeValue {
        switch (expression.type) {
            case "LiteralExpression":
                return expression.value;

            case "IdentifierExpression":
                return this.environment.get(expression.name);

            case "BinaryExpression":
                return this.evaluateBinaryExpression(
                    expression.operator,
                    expression.left,
                    expression.right,
                    expression
                );

            case "UnaryExpression":
                return this.evaluateUnaryExpression(
                    expression.operator,
                    expression.operand,
                    expression
                );

            default:
                throw new RuntimeError(`Sentencia no soportada: ${String(expression)}`);
        }
    }

    private evaluateBinaryExpression(
        operator: BinaryOperator,
        leftExpression: Expression,
        rightExpression: Expression,
        expression: Expression
    ) : RuntimeValue {
        const left = this.evaluateExpression(leftExpression);
        const right = this.evaluateExpression(rightExpression);

        switch (operator) {
            case "+":
                if (typeof left === "string" || typeof right === "string") {
                    return this.stringify(left) + this.stringify(right);
                }

                return this.requireNumber(left, expression)
                    + this.requireNumber(right, expression);

            case "-":
                return this.requireNumber(left, expression)
                    - this.requireNumber(right, expression);

            case "*":
                return this.requireNumber(left, expression)
                    * this.requireNumber(right, expression);

            case "/": {
                const divisor = this.requireNumber(
                    right,
                    expression
                );

                if (divisor === 0) {
                    throw new RuntimeError(
                        "No se puede dividir entre cero.",
                        expression.location.start.line,
                        expression.location.start.column
                    );
                }

                return this.requireNumber(left, expression)
                    / divisor;
            }

            case "%": {
                const divisor = this.requireNumber(
                    right,
                    expression
                );

                if (divisor === 0) {
                    throw new RuntimeError(
                        "No se puede calcular el módulo con divisor 0.",
                        expression.location.start.line,
                        expression.location.start.column
                    );
                }

                return this.requireNumber(left, expression)
                    % divisor;
            }

            case ">":
                return this.compare(left, right, expression) > 0;

            case ">=":
                return this.compare(left, right, expression) >= 0;

            case "<":
                return this.compare(left, right, expression) < 0;

            case "<=":
                return this.compare(left, right, expression) <= 0;

            case "=":
                return left === right;

            case "<>":
                return left !== right;

            case "Y":
                return this.isTruthy(left) && this.isTruthy(right);

            case "O":
                return this.isTruthy(left) || this.isTruthy(right);

            default:
                throw new RuntimeError(
                    `Operador no soportado: ${operator}`,
                    expression.location.start.line,
                    expression.location.start.column
                );
        }
    }

    private evaluateUnaryExpression(
        operator: UnaryOperator,
        operandExpression: Expression,
        expression: Expression
    ) : RuntimeValue {
        const operand = this.evaluateExpression(
            operandExpression
        );

        switch (operator) {
            case "-":
                return -this.requireNumber(
                    operand,
                    expression
                );

            case "NO":
                return !this.isTruthy(operand);

            default:
                throw new RuntimeError(
                    `Operador unario no soportado: ${operator}`,
                    expression.location.start.line,
                    expression.location.start.column
                );
        }
    }

    private compare(
        left: RuntimeValue,
        right: RuntimeValue,
        expression: Expression
    ) : number {
        if (
            typeof left === "number" &&
            typeof right === "number"
        ) {
            return left - right;
        }

        if (
            typeof left === "string" &&
            typeof right === "string"
        ) {
            return left.localeCompare(right);
        }

        throw new RuntimeError(
            "No se pueden comparar estos tipos de datos.",
            expression.location.start.line,
            expression.location.start.column
        );
    }

    private requireNumber(
        value: RuntimeValue,
        node: { location: { start: { line: number; column: number } } }
    ) : number {
        if (typeof value !== "number") {
            throw new RuntimeError(
                "Se esperaba un valor numérico.",
                node.location.start.line,
                node.location.start.column
            );
        }

        return value;
    }

    private isTruthy(value: RuntimeValue): boolean {
        if (typeof value === "boolean") {
            return value;
        }

        if (typeof value === "number") {
            return value !== 0;
        }

        if (typeof value === "string") {
            return value.length > 0;
        }

        return false;
    }

    private stringify(value: RuntimeValue): string {
        if (value === null) {
            return "";
        }

        if (typeof value === "boolean") {
            return value ? "Verdadero" : "Falso";
        }

        return String(value);
    }

    private defaultValue(
        dataType: VariableDeclaration["dataType"]
    ) : RuntimeValue {
        switch (dataType) {
            case "Integer":
            case "Real":
                return 0;

            case "Caracter":
                return "";

            case "Logico":
                return false;

            default:
                return null;
        }
    }

    async executeAsync(
        program: Program
    ) : Promise<RuntimeResult> {
        this.environment.clear();
        this.output.length = 0;

        for (const statement of program.body) {
            await this.executeStatementAsync(statement);
        }

        return {
            output: [...this.output],
            variables: this.environment.snapshot()
        };
    }

    private async executeStatementAsync( statement: Statement ) : Promise<void> {
        
        if (statement.type === "InputStatement") {
            await this.executeInputAsync(statement);
            return;
        }

        if (statement.type === "IfStatement") {
            const condition = this.evaluateExpression(
                statement.condition
            );

            const branch = this.isTruthy(condition)
                ? statement.thenBranch
                : statement.elseBranch;

            for (const child of branch) {
                await this.executeStatementAsync(child);
            }

            return;
        }

        if (statement.type === "WhileStatement") {
            while (
                this.isTruthy(
                    this.evaluateExpression(statement.condition)
                )
            ) {
                for (const child of statement.body) {
                    await this.executeStatementAsync(child);
                }
            }

            return;
        }

        if (statement.type === "ForStatement") {
            const start = this.requireNumber(
                this.evaluateExpression(statement.start),
                statement
            );

            const end = this.requireNumber(
                this.evaluateExpression(statement.end),
                statement
            );

            const step = this.requireNumber(
                this.evaluateExpression(statement.step),
                statement
            );

            if (step === 0) {
                throw new RuntimeError(
                    "El paso de un ciclo Para no puede ser 0.",
                    statement.location.start.line,
                    statement.location.start.column
                );
            }

            if (!this.environment.has(statement.variable)) {
                this.environment.define(
                    statement.variable,
                    start
                );
            } else {
                this.environment.set(
                    statement.variable,
                    start
                );
            }

            const shouldContinue = (value: number): boolean =>
                step > 0
                    ? value <= end
                    : value >= end;

            while (
                shouldContinue(
                    this.requireNumber(
                        this.environment.get(statement.variable),
                        statement
                    )
                )
            ) {
                for (const child of statement.body) {
                    await this.executeStatementAsync(child);
                }

                const current = this.requireNumber(
                    this.environment.get(statement.variable),
                    statement
                );

                this.environment.set(
                    statement.variable,
                    current + step
                );
            }

            return;
        }

        switch (statement.type) {
            case "VariableDeclaration":
                this.executeVariableDeclaration(statement);
                break;

            case "Assignment":
                this.executeAssignment(statement);
                break;

            case "OutputStatement":
                this.executeOutput(statement);
                break;

            default:
                this.executeStatementInternal(statement);
        }
    }

    evaluateExpressionPublic(
        expression: Expression
    ) : RuntimeValue {
        return this.evaluateExpression(expression);
    }

    isTruthyPublic(value: RuntimeValue): boolean {
        return this.isTruthy(value);
    }

}