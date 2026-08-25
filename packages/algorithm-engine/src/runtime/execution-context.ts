import type { Statement } from "../ast";

import { Environment } from "./environment";
import { Runtime } from "./runtime";
import type { Expression } from "../ast";

import type { RuntimeValue } from "./value";

export type InputProvider = (variable: string) => RuntimeValue;

export class ExecutionContext {

    readonly environment: Environment;
    readonly output: string[];

    private readonly runtime: Runtime;

    private waitingForInput = false;
    private requestedVariable: string | null = null;

    private inputCompleted = false;


    constructor(input?: InputProvider) {

        this.environment = new Environment();
        this.output = [];

        const options = input
            ? {
                preserveState: true,
                input
            }
            : {
                preserveState: true
            };

        this.runtime = new Runtime(
            options,
            this.environment,
            this.output
        );
    }

    reset(): void {
        this.environment.clear();
        this.output.length = 0;

        this.waitingForInput = false;
        this.requestedVariable = null;
        this.inputCompleted = false;
    }

    executeStatement(statement: Statement): void {
        if (statement.type === "InputStatement") {
            this.requestInput(statement.variable);
            return;
        }

        this.runtime.executeStatement(statement);
    }

    requestInput(variable: string): void {
        this.waitingForInput = true;
        this.requestedVariable = variable;
    }

    isWaitingForInput(): boolean {
        return this.waitingForInput;
    }

    getInputVariable(): string | null {
        return this.requestedVariable;
    }

    parseInput(
        variable: string,
        value: string
    ) : RuntimeValue {

        const dataType = this.environment.getType(variable);

        switch (dataType) {

            case "Integer": {
                const parsed = Number(value);

                if (!Number.isInteger(parsed)) {
                    throw new Error(
                        `Se esperaba un valor entero para '${variable}'.`
                    );
                }

                return parsed;
            }

            case "Real": {
                const parsed = Number(value);

                if (Number.isNaN(parsed)) {
                    throw new Error(
                        `Se esperaba un valor numérico para '${variable}'.`
                    );
                }

                return parsed;
            }

            case "Caracter":
                return value;

            case "Logico": {
                const normalized = value
                    .trim()
                    .toLowerCase();

                if (
                    normalized === "verdadero" ||
                    normalized === "true"
                ) {
                    return true;
                }

                if (
                    normalized === "falso" ||
                    normalized === "false"
                ) {
                    return false;
                }

                throw new Error(
                    `Se esperaba Verdadero o Falso para '${variable}'.`
                );
            }

            default:
                throw new Error(
                    `Tipo de dato no soportado para '${variable}'.`
                );
        }
    }

    provideInput(value: string): void {

        if (!this.requestedVariable) {
            throw new Error(
                "No hay una entrada pendiente."
            );
        }

        const variable = this.requestedVariable;

        const parsedValue = this.parseInput(
            variable,
            value
        );

        this.environment.set(
            variable,
            parsedValue
        );

        this.waitingForInput = false;
        this.inputCompleted = true;
        this.requestedVariable = null;
    }

    consumeInputCompleted(): boolean {
        if (!this.inputCompleted) {
            return false;
        }

        this.inputCompleted = false;

        return true;
    }

    getVariables(): Record<string, RuntimeValue> {
        return this.environment.snapshot();
    }

    getOutput(): string[] {
        return [...this.output];
    }

    evaluateExpression(expression: Expression): RuntimeValue {
        return this.runtime.evaluateExpressionPublic(expression);
    }

    isTruthy(value: RuntimeValue): boolean {
        return this.runtime.isTruthyPublic(value);
    }

}