import type { ForStatement } from "../../ast";
import type {
    FlowchartBuilderContext,
    FlowchartFragment
} from "./statement-builder";

export function buildForStatement(
    statement: ForStatement,
    context: FlowchartBuilderContext,
    buildStatement: (
        statement: any,
        context: FlowchartBuilderContext
    ) => FlowchartFragment
) : FlowchartFragment {

    const initialization = context.addNode(
        "process",
        `${statement.variable} <- ...`
    );

    const condition = context.addNode(
        "decision",
        `${statement.variable} <= ...`
    );

    context.connect(
        initialization,
        condition
    );

    const bodyEntry = context.addNode(
        "process",
        "..."
    );

    context.connect(
        condition,
        bodyEntry,
        "Sí"
    );

    const increment = context.addNode(
        "process",
        `${statement.variable} <- ${statement.variable} + ...`
    );

    context.connect(
        bodyEntry,
        increment
    );

    context.connect(
        increment,
        condition
    );

    const exit = context.addNode(
        "process",
        "Continuar"
    );

    context.connect(
        condition,
        exit,
        "No"
    );

    return {
        entry: initialization,
        exit
    };
}