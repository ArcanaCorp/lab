import type { Expression } from "../ast";

export function expressionToString(expression: Expression): string {
    switch (expression.type) {
        case "LiteralExpression":
            return formatLiteral(expression.value);

        case "IdentifierExpression":
            return expression.name;

        case "UnaryExpression":
            return `${expression.operator}${formatUnaryOperand(expression.operand)}`;

        case "BinaryExpression":
            return [
                formatBinaryOperand(expression.left),
                expression.operator,
                formatBinaryOperand(expression.right)
            ].join(" ");

        default:
            throw new Error("Expression printer not implemented");
    }
}

function formatLiteral(value: string | number | boolean): string {
    if (typeof value === "string") {
        return `"${value}"`;
    }

    if (typeof value === "boolean") {
        return value ? "Verdadero" : "Falso";
    }

    return String(value);
}

function formatUnaryOperand(expression: Expression): string {
    if (expression.type === "BinaryExpression") {
        return `(${expressionToString(expression)})`;
    }

    return expressionToString(expression);
}

function formatBinaryOperand(expression: Expression): string {
    if (expression.type === "BinaryExpression") {
        return `(${expressionToString(expression)})`;
    }

    return expressionToString(expression);
}