import type { Statement } from "../../ast";

import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

import { IfFrame } from "./if-frame";
import { WhileFrame } from "./while-frame";
import { ForFrame } from "./for-frame";

export class BlockFrame implements ExecutionFrame {

    readonly type = "BlockFrame";

    private readonly statements: Statement[];

    private index = 0;

    private childFrame: ExecutionFrame | null = null;

    constructor(statements: Statement[]) {
        this.statements = statements;
    }

    step(context: ExecutionContext): boolean {

        if (this.isComplete()) {
            return false;
        }

        /*
         * Si tenemos un frame hijo, continuamos
         * ejecutándolo.
         */
        if (this.childFrame) {

            this.childFrame.step(context);

            /*
             * El hijo está esperando entrada.
             */
            if (context.isWaitingForInput()) {
                return false;
            }

            /*
             * El hijo todavía no terminó.
             */
            if (!this.childFrame.isComplete()) {
                return true;
            }

            /*
             * El hijo terminó.
             */
            this.childFrame = null;

            this.index++;

            return true;
        }

        /*
         * Si acabamos de recibir una entrada,
         * la entrada pertenece a la sentencia actual
         * y ahora podemos avanzar.
         */
        if (context.consumeInputCompleted()) {
            this.index++;

            return true;
        }

        const statement = this.statements[this.index];

        if (!statement) {
            return false;
        }

        /*
         * Los bloques de control NO deben ejecutarse
         * directamente dentro de Runtime.
         *
         * Creamos frames para poder pausarlos.
         */
        switch (statement.type) {

            case "IfStatement":
                this.childFrame = new IfFrame(
                    statement,
                    context
                );

                this.childFrame.step(context);

                return true;

            case "WhileStatement":
                this.childFrame = new WhileFrame(
                    statement
                );

                this.childFrame.step(context);

                return true;

            case "ForStatement":
                this.childFrame = new ForFrame(
                    statement
                );

                this.childFrame.step(context);

                return true;

            default:
                context.executeStatement(statement);
        }

        /*
         * Si la sentencia pidió entrada,
         * NO avanzamos el índice.
         */
        if (context.isWaitingForInput()) {
            return false;
        }

        this.index++;

        return true;
    }

    isComplete(): boolean {
        return (
            this.index >= this.statements.length &&
            this.childFrame === null
        );
    }

    get currentIndex(): number {
        return this.index;
    }
}