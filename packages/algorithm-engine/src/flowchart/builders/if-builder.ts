import type { Statement } from "../../ast";
import type { FlowchartBuilderContext, FlowchartFragment } from "./statement-builder";
import { formatExpression } from "../expression-label";

export function buildIfStatement(
    statement: Extract<Statement, { type: "IfStatement" }>,
    context: FlowchartBuilderContext,
    buildStatement: (
        statement: Statement,
        context: FlowchartBuilderContext
    ) => FlowchartFragment
) : FlowchartFragment {

    const decision = context.addNode("decision", formatExpression(statement.condition));

    let thenExit = decision;

    for (const child of statement.thenBranch) {
        const fragment = buildStatement(
            child,
            context
        );

        context.connect(
            thenExit,
            fragment.entry,
            thenExit === decision ? "Sí" : undefined
        );

        thenExit = fragment.exit;
    }

    let elseExit = decision;

    for (const child of statement.elseBranch) {
        const fragment = buildStatement(
            child,
            context
        );

        context.connect(
            elseExit,
            fragment.entry,
            elseExit === decision ? "No" : undefined
        );

        elseExit = fragment.exit;
    }

    const merge = context.addNode("merge", "");

    context.connect(thenExit, merge);

    if (statement.elseBranch.length > 0) {
        context.connect(elseExit, merge);
    } else {
        context.connect(decision, merge, "No");
    }

    return {
        entry: decision,
        exit: merge
    };
}