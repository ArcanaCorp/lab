import type { ForStatement } from "../../ast";

import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

import { BlockFrame } from "./block-frame";

export class ForFrame implements ExecutionFrame {

    readonly type = "ForFrame";

    private readonly statement: ForStatement;

    private bodyFrame: BlockFrame | null = null;

    private current: number | null = null;

    private end: number | null = null;

    private stepValue: number | null = null;

    private finished = false;

    constructor(statement: ForStatement) {
        this.statement = statement;
    }

    step(context: ExecutionContext): boolean {

        if (this.finished) {
            return false;
        }

        /*
         * Inicializar el Para.
         */
        if (
            this.current === null ||
            this.end === null ||
            this.stepValue === null
        ) {

            this.current = this.requireNumber(
                context.evaluateExpression(
                    this.statement.start
                ),
                this.statement,
                context
            );

            this.end = this.requireNumber(
                context.evaluateExpression(
                    this.statement.end
                ),
                this.statement,
                context
            );

            this.stepValue = this.requireNumber(
                context.evaluateExpression(
                    this.statement.step
                ),
                this.statement,
                context
            );

            if (this.stepValue === 0) {
                throw new Error(
                    "El paso de un ciclo Para no puede ser 0."
                );
            }

            /*
             * Definir o inicializar variable de control.
             */
            if (!context.environment.has(this.statement.variable)) {

                context.environment.define(
                    this.statement.variable,
                    this.current,
                    "Integer"
                );

            } else {

                context.environment.set(
                    this.statement.variable,
                    this.current
                );
            }
        }

        /*
         * Continuar cuerpo de la iteración actual.
         */
        if (this.bodyFrame) {

            this.bodyFrame.step(context);

            if (context.isWaitingForInput()) {
                return false;
            }

            if (!this.bodyFrame.isComplete()) {
                return true;
            }

            /*
             * Terminó el cuerpo.
             */
            this.bodyFrame = null;

            this.current =
                this.current + this.stepValue;

            context.environment.set(
                this.statement.variable,
                this.current
            );
        }

        /*
         * Verificar si debe comenzar otra iteración.
         */
        const shouldContinue =
            this.stepValue > 0
                ? this.current <= this.end
                : this.current >= this.end;

        if (!shouldContinue) {
            this.finished = true;
            return true;
        }

        /*
         * Ejecutar cuerpo.
         */
        this.bodyFrame = new BlockFrame(
            this.statement.body
        );

        return true;
    }

    isComplete(): boolean {
        return this.finished;
    }

    private requireNumber(
        value: unknown,
        node: ForStatement,
        context: ExecutionContext
    ): number {

        if (typeof value !== "number") {
            throw new Error(
                "Se esperaba un valor numérico."
            );
        }

        return value;
    }
}