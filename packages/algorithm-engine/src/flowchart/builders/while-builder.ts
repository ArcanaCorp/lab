import type { Statement } from "../../ast";
import type { FlowchartBuilderContext, FlowchartFragment } from "./statement-builder";
import { formatExpression } from "../expression-label";

export function buildWhileStatement(
    statement: Extract<Statement, { type: "WhileStatement" }>,
    context: FlowchartBuilderContext,
    buildStatement: (
        statement: Statement,
        context: FlowchartBuilderContext
    ) => FlowchartFragment
) : FlowchartFragment {
    
    const decision = context.addNode("decision", formatExpression(statement.condition));

    let bodyEntry: string | undefined;
    let bodyExit: string | undefined;

    for (const child of statement.body) {
        
        const fragment = buildStatement(
            child,
            context
        );

        if (!bodyEntry) {
            bodyEntry = fragment.entry;

            context.connect(
                decision,
                fragment.entry,
                "Sí"
            );
        } else {
            context.connect(
                bodyExit!,
                fragment.entry
            );
        }

        bodyExit = fragment.exit;
    }

    const exit = context.addNode("merge", "");

    context.connect(decision, exit, "No");

    if (bodyExit) {
        context.connect(
            bodyExit,
            decision
        );
    } else {
        context.connect(
            decision,
            decision,
            "Sí"
        );
    }

    return {
        entry: decision,
        exit
    };
}