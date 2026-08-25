import type {
    Program,
    Statement,
    Expression
} from "../../ast";

export function generateJava(program: Program): string {

    const lines: string[] = [];

    const className = sanitizeClassName(
        program.name
    );

    lines.push("import java.util.Scanner;");
    lines.push("");
    lines.push(`public class ${className} {`);
    lines.push("");
    lines.push("    public static void main(String[] args) {");
    lines.push("");
    lines.push("        Scanner scanner = new Scanner(System.in);");
    lines.push("");

    for (const statement of program.body) {

        generateStatement(
            statement,
            lines,
            2
        );
    }

    lines.push("");
    lines.push("        scanner.close();");
    lines.push("    }");
    lines.push("}");

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

            const type = javaType(
                statement.dataType
            );

            const value = defaultValue(
                statement.dataType
            );

            lines.push(
                `${space}${type} ${statement.name} = ${value};`
            );

            break;
        }


        case "Assignment":

            lines.push(
                `${space}${statement.variable} = ${generateExpression(statement.value)};`
            );

            break;


        case "InputStatement":

            generateInput(
                statement,
                lines,
                indent
            );

            break;


        case "OutputStatement":

            lines.push(
                `${space}System.out.println(${generateExpression(statement.expression)});`
            );

            break;


        case "IfStatement":

            lines.push(
                `${space}if (${generateExpression(statement.condition)}) {`
            );

            for (const child of statement.thenBranch) {

                generateStatement(
                    child,
                    lines,
                    indent + 1
                );
            }

            if (statement.elseBranch.length > 0) {

                lines.push(
                    `${space}} else {`
                );

                for (const child of statement.elseBranch) {

                    generateStatement(
                        child,
                        lines,
                        indent + 1
                    );
                }
            }

            lines.push(
                `${space}}`
            );

            break;


        case "WhileStatement":

            lines.push(
                `${space}while (${generateExpression(statement.condition)}) {`
            );

            for (const child of statement.body) {

                generateStatement(
                    child,
                    lines,
                    indent + 1
                );
            }

            lines.push(
                `${space}}`
            );

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

            const operator =
                statement.step.type === "LiteralExpression" &&
                typeof statement.step.value === "number" &&
                statement.step.value < 0
                    ? ">="
                    : "<=";

            lines.push(
                `${space}for (${statement.variable} = ${start}; ${statement.variable} ${operator} ${end}; ${statement.variable} += ${step}) {`
            );

            for (const child of statement.body) {

                generateStatement(
                    child,
                    lines,
                    indent + 1
                );
            }

            lines.push(
                `${space}}`
            );

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


function generateInput(
    statement: Extract<Statement, { type: "InputStatement" }>,
    lines: string[],
    indent: number
): void {

    const space = "    ".repeat(indent);

    /*
     * Scanner no puede saber automáticamente
     * el tipo si solamente vemos el InputStatement.
     *
     * Por ahora usamos nextLine() para Caracter.
     *
     * Más adelante podemos consultar la tabla semántica
     * para generar nextInt(), nextDouble(), etc.
     */

    lines.push(
        `${space}${statement.variable} = scanner.nextLine();`
    );
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
                return "null";
            }

            if (typeof expression.value === "boolean") {

                return expression.value
                    ? "true"
                    : "false";
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
            return "&&";

        case "O":
            return "||";

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
            return "!";

        default:
            return operator;
    }
}


function javaType(
    dataType: string
): string {

    switch (dataType) {

        case "Integer":
            return "int";

        case "Real":
            return "double";

        case "Caracter":
            return "String";

        case "Logico":
            return "boolean";

        default:
            return "Object";
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
            return "false";

        default:
            return "null";
    }
}


function sanitizeClassName(
    name: string
): string {

    const sanitized = name
        .replace(/[^a-zA-Z0-9_$]/g, "")
        .replace(/^[0-9]+/, "");

    if (!sanitized) {
        return "Main";
    }

    return sanitized;
}