import type { ForStatement, Statement } from "../../ast";
import type {
    FlowchartBuilderContext,
    FlowchartFragment
} from "./statement-builder";
import { formatExpression } from "../expression-label";

export function buildForStatement(
    statement: ForStatement,
    context: FlowchartBuilderContext,
    buildStatement: (
        statement: Statement,
        context: FlowchartBuilderContext
    ) => FlowchartFragment
): FlowchartFragment {

    /*
     * =========================
     * INICIALIZACIÓN
     * =========================
     */

    const initialization = context.addNode(
        "process",
        `${statement.variable} <- ${formatExpression(statement.start)}`
    );

    /*
     * =========================
     * CONDICIÓN
     * =========================
     */

    const condition = context.addNode(
        "decision",
        `${statement.variable} <= ${formatExpression(statement.end)}`
    );

    context.connect(
        initialization,
        condition
    );

    /*
     * =========================
     * CUERPO DEL PARA
     * =========================
     */

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
                condition,
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

    /*
     * =========================
     * INCREMENTO
     * =========================
     */

    const increment = context.addNode(
        "process",
        `${statement.variable} <- ${statement.variable} + ${formatExpression(statement.step)}`
    );

    /*
     * Si el Para tiene cuerpo:
     *
     * condición
     *      ↓ Sí
     *    cuerpo
     *      ↓
     * incremento
     *      ↓
     * condición
     */

    if (bodyExit) {
        context.connect(
            bodyExit,
            increment
        );
    } else {
        /*
         * Para vacío:
         *
         * condición → incremento
         */
        context.connect(
            condition,
            increment,
            "Sí"
        );
    }

    context.connect(
        increment,
        condition
    );

    /*
     * =========================
     * SALIDA
     * =========================
     */

    const exit = context.addNode(
        "merge",
        ""
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