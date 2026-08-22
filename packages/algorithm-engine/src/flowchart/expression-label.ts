import type { Expression } from "../ast";

export function formatExpression(expression: Expression) : string {
    
    switch (expression.type) {
        case "LiteralExpression":
            return String(expression.value);

        case "IdentifierExpression":
            return expression.name;

        case "BinaryExpression":
            return `${formatExpression(expression.left)} ${expression.operator} ${formatExpression(expression.right)}`;

        case "UnaryExpression":
            return `${expression.operator}${formatExpression(expression.operand)}`;

        default:
            return "...";
    }
}