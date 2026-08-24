import type { Program } from "../../ast";

import type { ExecutionContext } from "../execution-context";
import type { ExecutionFrame } from "./execution-frame";

import { BlockFrame } from "./block-frame";

export class ProgramFrame implements ExecutionFrame {
    readonly type = "ProgramFrame";

    private readonly block: BlockFrame;

    constructor(program: Program) {
        this.block = new BlockFrame(
            program.body
        );
    }

    step(context: ExecutionContext): boolean {
        return this.block.step(context);
    }

    isComplete(): boolean {
        return this.block.isComplete();
    }

    get currentIndex(): number {
        return this.block.currentIndex;
    }
}