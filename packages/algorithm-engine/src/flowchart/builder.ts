import type { Program, Statement } from "../ast";
import type { Flowchart, FlowchartEdge, FlowchartNode } from "./model";
import type { FlowchartBuilderContext, FlowchartFragment } from "./builders/statement-builder";
import { buildIfStatement } from "./builders/if-builder";
import { buildWhileStatement } from "./builders/while-builder";
import { buildForStatement } from "./builders/for-builder"
import { expressionToString } from "../printer/expression-printer";

export function buildFlowchart( program: Program ) : Flowchart {
  
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];

    let nodeCounter = 0;
    let edgeCounter = 0;

    const context: FlowchartBuilderContext = {
        nodes,
        edges,

        addNode(type, label) {
            const id = `flow_${++nodeCounter}`;
            nodes.push({
                id,
                type,
                label
            });
            return id;
        },

        connect(source, target, label) {
            const edge: FlowchartEdge = {
                id: `edge_${++edgeCounter}`,
                source,
                target
            };

            if (label !== undefined) {
                edge.label = label;
            }

            edges.push(edge);
        }
    };

    const start = context.addNode("start", program.name);

    let previous = start;

    for (const statement of program.body) {
        
        const fragment = buildStatement(statement, context);

        context.connect(previous, fragment.entry);

        previous = fragment.exit;
    }

    const end = context.addNode("end", "Fin");

    context.connect(previous, end);

    return {
        nodes,
        edges
    };

    function buildStatement(statement: Statement, context: FlowchartBuilderContext) : FlowchartFragment {
    
        switch (statement.type) {

            case "VariableDeclaration": {
                const id = context.addNode("process", `Definir ${statement.name} Como ${statement.dataType}`);
                return {
                    entry: id,
                    exit: id
                };
            }

            case "Assignment": {
                const id = context.addNode(
                    "process",
                    `${statement.variable} <- ${expressionToString(statement.value)}`
                );

                return {
                    entry: id,
                    exit: id
                };
            }

            case "InputStatement": {
                const id = context.addNode("input", `Leer ${statement.variable}`);
                return {
                    entry: id,
                    exit: id
                };
            }

            case "OutputStatement": {
                const id = context.addNode(
                    "output",
                    `Escribir ${expressionToString(statement.expression)}`
                );

                return {
                    entry: id,
                    exit: id
                };
            }

            case "IfStatement":
                return buildIfStatement(statement, context, buildStatement);

            case "WhileStatement":
                return buildWhileStatement(statement, context, buildStatement);

            case "ForStatement":
                return buildForStatement(statement, context, buildStatement);

            default:
                throw new Error(`Flowchart node not implemented: ${statement.type}`);
        }
    }

}