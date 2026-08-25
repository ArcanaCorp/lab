import type { WhileStatement } from "../../ast";

import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

import { BlockFrame } from "./block-frame";

export class WhileFrame implements ExecutionFrame {

    readonly type = "WhileFrame";

    private readonly statement: WhileStatement;

    private bodyFrame: BlockFrame | null = null;

    private finished = false;

    constructor(statement: WhileStatement) {
        this.statement = statement;
    }

    step(context: ExecutionContext): boolean {

        if (this.finished) {
            return false;
        }

        /*
         * Estamos ejecutando el cuerpo.
         */
        if (this.bodyFrame) {

            this.bodyFrame.step(context);

            /*
             * El cuerpo pidió una entrada.
             */
            if (context.isWaitingForInput()) {
                return false;
            }

            /*
             * El cuerpo todavía tiene sentencias.
             */
            if (!this.bodyFrame.isComplete()) {
                return true;
            }

            /*
             * Terminó una iteración.
             */
            this.bodyFrame = null;
        }

        /*
         * Evaluar condición antes de comenzar
         * la siguiente iteración.
         */
        const condition = context.evaluateExpression(
            this.statement.condition
        );

        if (!context.isTruthy(condition)) {
            this.finished = true;
            return true;
        }

        /*
         * Nueva iteración.
         */
        this.bodyFrame = new BlockFrame(
            this.statement.body
        );

        return true;
    }

    isComplete(): boolean {
        return this.finished;
    }
}