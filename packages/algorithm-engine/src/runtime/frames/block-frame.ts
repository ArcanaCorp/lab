import type { Statement } from "../../ast";
import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

export class BlockFrame implements ExecutionFrame {
    readonly type = "BlockFrame";

    private readonly statements: Statement[];
    private index = 0;

    constructor(statements: Statement[]) {
        this.statements = statements;
    }

    step(context: ExecutionContext): boolean {

        if (this.isComplete()) {
            return false;
        }

        const statement = this.statements[this.index];

        if (!statement) {
            return false;
        }

        context.executeStatement(statement);

        this.index++;

        return true;
    }

    isComplete(): boolean {
        return this.index >= this.statements.length;
    }

    get currentIndex(): number {
        return this.index;
    }
}