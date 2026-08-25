import type {
    Program,
    Statement,
    Expression
} from "../../ast";

export function generatePython(program: Program): string {

    const lines: string[] = [];

    lines.push(`# ${program.name}`);
    lines.push("");

    for (const statement of program.body) {
        generateStatement(statement, lines, 0);
    }

    return lines.join("\n");
}


function generateStatement(
    statement: Statement,
    lines: string[],
    indent: number
): void {

    const space = "    ".repeat(indent);

    switch (statement.type) {

        case "VariableDeclaration": {

            const value = defaultValue(statement.dataType);

            lines.push(
                `${space}${statement.name} = ${value}`
            );

            break;
        }


        case "Assignment":

            lines.push(
                `${space}${statement.variable} = ${generateExpression(statement.value)}`
            );

            break;


        case "InputStatement":

            lines.push(
                `${space}${statement.variable} = input("Ingrese ${statement.variable}: ")`
            );

            break;


        case "OutputStatement":

            lines.push(
                `${space}print(${generateExpression(statement.expression)})`
            );

            break;


        case "IfStatement":

            lines.push(
                `${space}if ${generateExpression(statement.condition)}:`
            );

            if (statement.thenBranch.length === 0) {
                lines.push(
                    `${space}    pass`
                );
            } else {
                for (const child of statement.thenBranch) {
                    generateStatement(
                        child,
                        lines,
                        indent + 1
                    );
                }
            }

            if (statement.elseBranch.length > 0) {

                lines.push(
                    `${space}else:`
                );

                for (const child of statement.elseBranch) {
                    generateStatement(
                        child,
                        lines,
                        indent + 1
                    );
                }
            }

            break;


        case "WhileStatement":

            lines.push(
                `${space}while ${generateExpression(statement.condition)}:`
            );

            if (statement.body.length === 0) {
                lines.push(
                    `${space}    pass`
                );
            } else {
                for (const child of statement.body) {
                    generateStatement(
                        child,
                        lines,
                        indent + 1
                    );
                }
            }

            break;


        case "ForStatement": {

            const start = generateExpression(
                statement.start
            );

            const end = generateExpression(
                statement.end
            );

            const step = generateExpression(
                statement.step
            );

            lines.push(
                `${space}for ${statement.variable} in range(${start}, (${end}) + 1, ${step}):`
            );

            if (statement.body.length === 0) {
                lines.push(
                    `${space}    pass`
                );
            } else {
                for (const child of statement.body) {
                    generateStatement(
                        child,
                        lines,
                        indent + 1
                    );
                }
            }

            break;
        }


        default: {

            const unreachable: never = statement;

            throw new Error(
                `Sentencia no soportada: ${String(unreachable)}`
            );
        }
    }
}


function generateExpression(
    expression: Expression
): string {

    switch (expression.type) {

        case "LiteralExpression":

            if (typeof expression.value === "string") {
                return JSON.stringify(
                    expression.value
                );
            }

            if (expression.value === null) {
                return "None";
            }

            if (typeof expression.value === "boolean") {
                return expression.value
                    ? "True"
                    : "False";
            }

            return String(expression.value);


        case "IdentifierExpression":

            return expression.name;


        case "BinaryExpression":

            return `(${generateExpression(expression.left)} ${mapBinaryOperator(expression.operator)} ${generateExpression(expression.right)})`;


        case "UnaryExpression":

            return `${mapUnaryOperator(expression.operator)}${generateExpression(expression.operand)}`;


        default: {

            const unreachable: never = expression;

            throw new Error(
                `Expresión no soportada: ${String(unreachable)}`
            );
        }
    }
}


function mapBinaryOperator(
    operator: string
): string {

    switch (operator) {

        case "Y":
            return "and";

        case "O":
            return "or";

        case "=":
            return "==";

        case "<>":
            return "!=";

        default:
            return operator;
    }
}


function mapUnaryOperator(
    operator: string
): string {

    switch (operator) {

        case "NO":
            return "not ";

        default:
            return operator;
    }
}


function defaultValue(
    dataType: string
): string {

    switch (dataType) {

        case "Integer":
        case "Real":
            return "0";

        case "Caracter":
            return `""`;

        case "Logico":
            return "False";

        default:
            return "None";
    }
}