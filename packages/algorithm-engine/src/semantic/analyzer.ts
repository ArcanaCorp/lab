import type {
    Program,
    Statement,
    Expression,
    VariableDeclaration
} from "../ast";

import type { Diagnostic } from "./diagnostics";
import { SymbolTable } from "./symbols";

export class SemanticAnalyzer {

    private diagnostics: Diagnostic[] = [];
    private symbols = new SymbolTable();

    analyze(program: Program): Diagnostic[] {
        this.diagnostics = [];
        this.symbols = new SymbolTable();

        for (const statement of program.body) {
            this.analyzeStatement(statement);
        }

        return this.diagnostics;
    }

    private analyzeStatement(statement: Statement): void {
        switch (statement.type) {

            case "VariableDeclaration":
                this.analyzeVariableDeclaration(statement);
                break;

            case "Assignment":
                this.analyzeAssignment(statement);
                break;

            case "InputStatement":
                this.analyzeInput(statement);
                break;

            case "OutputStatement":
                this.analyzeExpression(statement.expression);
                break;

            case "IfStatement":
                this.analyzeExpression(statement.condition);

                for (const nestedStatement of statement.thenBranch) {
                    this.analyzeStatement(nestedStatement);
                }

                for (const nestedStatement of statement.elseBranch) {
                    this.analyzeStatement(nestedStatement);
                }

                break;

            case "WhileStatement":
                this.analyzeExpression(statement.condition);
                break;

            case "ForStatement":
                this.analyzeExpression(statement.start);
                this.analyzeExpression(statement.end);
                this.analyzeExpression(statement.step);

                for (const nestedStatement of statement.body) {
                    this.analyzeStatement(nestedStatement);
                }

                break;
        }
    }

    private analyzeVariableDeclaration(statement: VariableDeclaration) : void {
        const defined = this.symbols.define({
            name: statement.name,
            dataType: statement.dataType,
            location: statement.location
        });

        if (!defined) {
            this.diagnostics.push({
                severity: "error",
                code: "E002",
                message: `La variable '${statement.name}' ya fue declarada.`,
                location: statement.location
            });
        }
    }

    private analyzeAssignment(statement: Statement): void {
        if (statement.type !== "Assignment") {
            return;
        }

        const symbol = this.symbols.resolve(statement.variable);

        if (!symbol) {
            this.diagnostics.push({
                severity: "error",
                code: "SEM002",
                message: `La variable '${statement.variable}' no ha sido declarada.`,
                location: statement.location
            });
        }

        this.analyzeExpression(statement.value);
    }

    private analyzeInput(statement: Statement): void {
        if (statement.type !== "InputStatement") {
            return;
        }

        const symbol = this.symbols.resolve(statement.variable);

        if (!symbol) {
            this.diagnostics.push({
                severity: "error",
                code: "SEM002",
                message: `La variable '${statement.variable}' no ha sido declarada.`,
                location: statement.location
            });
        }
    }

    private analyzeExpression(expression: Expression): void {
        switch (expression.type) {

            case "IdentifierExpression": {
                const symbol = this.symbols.resolve(expression.name);

                if (!symbol) {
                    this.diagnostics.push({
                        severity: "error",
                        code: "E001",
                        message: `La variable '${expression.name}' no ha sido declarada.`,
                        location: expression.location
                    });
                }

                break;
            }

            case "BinaryExpression":
                this.analyzeExpression(expression.left);
                this.analyzeExpression(expression.right);
                break;

            case "UnaryExpression":
                this.analyzeExpression(expression.operand);
                break;

            case "LiteralExpression":
                break;

            default:
                break;
        }
    }

}

export function analyze(program: Program): Diagnostic[] {
    return new SemanticAnalyzer().analyze(program);
}