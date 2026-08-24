import { describe, expect, it } from "vitest";
import { tokenize, parse } from "../src";

describe("Parser", () => {
    
    it("parses an empty algorithm", () => {
        const source = `
            Algoritmo Hola

            FinAlgoritmo
        `;

        const tokens = tokenize(source);
        const program = parse(tokens);

        expect(program.type).toBe("Program");
        expect(program.name).toBe("Hola");
        expect(program.body).toHaveLength(0);
    });

    it("parses a variable declaration", () => {
        const source = `
            Algoritmo Test

                Definir edad Como Entero

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(1);

        expect(program.body[0]).toMatchObject({
            type: "VariableDeclaration",
            name: "edad",
            dataType: "Integer"
        });
    });

    it("parses input", () => {
        const source = `
            Algoritmo Test

                Definir edad Como Entero
                Leer edad

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body[1]).toMatchObject({
            type: "InputStatement",
            variable: "edad"
        });
    });

    it("parses output", () => {
        const source = `
            Algoritmo Test

                Escribir "Hola"

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body[0]).toMatchObject({
            type: "OutputStatement"
        });
    });

    it("parses an assignment", () => {
        const source = `
            Algoritmo Test

                edad <- 18

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body[0]).toMatchObject({
            type: "Assignment",
            variable: "edad"
        });

        expect(program.body[0]).toHaveProperty(
            "value.type",
            "LiteralExpression"
        );
    });

    it("parses binary expressions", () => {
        const source = `
            Algoritmo Test

                resultado <- 2 + 3 * 4

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const assignment = program.body[0];

        expect(assignment?.type).toBe("Assignment");

        if (assignment?.type === "Assignment") {
            
            expect(assignment.value.type).toBe("BinaryExpression");

            if (assignment.value.type === "BinaryExpression") {
                expect(assignment.value.operator).toBe("+");

                expect(assignment.value.right).toMatchObject({
                    type: "BinaryExpression",
                    operator: "*"
                });
            }
        }
    });

    it("respects parentheses", () => {
        const source = `
            Algoritmo Test

                resultado <- (2 + 3) * 4

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const assignment = program.body[0];

        expect(assignment?.type).toBe("Assignment");

        if (assignment?.type === "Assignment") {
            expect(assignment.value.type).toBe("BinaryExpression");

            if (assignment.value.type === "BinaryExpression") {
                expect(assignment.value.operator).toBe("*");

                expect(assignment.value.left).toMatchObject({
                    type: "BinaryExpression",
                    operator: "+"
                });
            }
        }
    });

    it("parses if statement", () => {
        const source = `
            Algoritmo MayorEdad

                Definir edad Como Entero

                Si edad >= 18 Entonces
                    Escribir "Mayor"
                FinSi

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(2);

        const statement = program.body[1];

        expect(statement?.type).toBe("IfStatement");

        if (statement?.type === "IfStatement") {
            expect(statement.condition).toMatchObject({type: "BinaryExpression", operator: ">="});

            expect(statement.thenBranch).toHaveLength(1);

            expect(statement.elseBranch).toHaveLength(0);
        }
    });

    it("parses if else statement", () => {
        const source = `
            Algoritmo MayorEdad

                Si edad >= 18 Entonces
                    Escribir "Mayor"
                SiNo
                    Escribir "Menor"
                FinSi

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const statement = program.body[0];

        expect(statement?.type).toBe("IfStatement");

        if (statement?.type === "IfStatement") {
            expect(statement.thenBranch).toHaveLength(1);
            expect(statement.elseBranch).toHaveLength(1);
        }
    });

    it("parses while statement", () => {
        const source = `
            Algoritmo Contador

                Mientras contador <= 10 Hacer
                    Escribir contador
                    contador <- contador + 1
                FinMientras

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const statement = program.body[0];

        expect(statement?.type).toBe("WhileStatement");

        if (statement?.type === "WhileStatement") {
            expect(statement.condition).toMatchObject({type: "BinaryExpression",operator: "<="});

            expect(statement.body).toHaveLength(2);
        }
    });

    it("parses output expressions", () => {
        const source = `
            Algoritmo Test

                Definir edad Como Entero

                Escribir edad
                Escribir edad + 1

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(3);

        const firstOutput = program.body[1];

        expect(firstOutput).toMatchObject({
            type: "OutputStatement"
        });

        if (firstOutput?.type === "OutputStatement") {
            expect(firstOutput.expression).toMatchObject({type: "IdentifierExpression",name: "edad"});
        }

        const secondOutput = program.body[2];

        expect(secondOutput).toMatchObject({
            type: "OutputStatement"
        });

        if (secondOutput?.type === "OutputStatement") {
            expect(secondOutput.expression).toMatchObject({type: "BinaryExpression", operator: "+"});
        }
    });

    it("parses a for statement", () => {
        const source = `
            Algoritmo Contador

                Para i <- 1 Hasta 10 Hacer
                    Escribir i
                FinPara

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(1);

        const statement = program.body[0];

        expect(statement?.type).toBe("ForStatement");

        if (!statement || statement.type !== "ForStatement") {
            return;
        }

        expect(statement.variable).toBe("i");

        expect(statement.start).toMatchObject({
            type: "LiteralExpression",
            value: 1
        });

        expect(statement.end).toMatchObject({
            type: "LiteralExpression",
            value: 10
        });

        expect(statement.step).toMatchObject({
            type: "LiteralExpression",
            value: 1
        });

        expect(statement.body).toHaveLength(1);

        expect(statement.body[0]?.type).toBe("OutputStatement");
    });

    it("parses for statement with explicit step", () => {
        const source = `
            Algoritmo Contador

                Para i <- 10 Hasta 1 Con Paso -1 Hacer
                    Escribir i
                FinPara

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const statement = program.body[0];

        expect(statement?.type).toBe("ForStatement");

        if (!statement || statement.type !== "ForStatement") {
            return;
        }

        expect(statement.variable).toBe("i");

        expect(statement.step).toMatchObject({
            type: "UnaryExpression",
            operator: "-"
        });
    });

    it("parses if statement inside for", () => {
        const source = `
            Algoritmo Prueba

                Para i <- 1 Hasta 10 Hacer
                    Si i > 5 Entonces
                        Escribir i
                    FinSi
                FinPara

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(1);

        const forStatement = program.body[0];

        expect(forStatement?.type).toBe("ForStatement");

        if (!forStatement || forStatement.type !== "ForStatement") {
            return;
        }

        expect(forStatement.body).toHaveLength(1);

        const ifStatement = forStatement.body[0];

        expect(ifStatement?.type).toBe("IfStatement");
    });

    it("parses nested for statements", () => {
        const source = `
            Algoritmo Tabla

                Para i <- 1 Hasta 10 Hacer
                    Para j <- 1 Hasta 10 Hacer
                        Escribir i * j
                    FinPara
                FinPara

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        expect(program.body).toHaveLength(1);

        const outerFor = program.body[0];

        expect(outerFor?.type).toBe("ForStatement");

        if (!outerFor || outerFor.type !== "ForStatement") {
            return;
        }

        expect(outerFor.body).toHaveLength(1);

        const innerFor = outerFor.body[0];

        expect(innerFor?.type).toBe("ForStatement");

        if (!innerFor || innerFor.type !== "ForStatement") {
            return;
        }

        expect(innerFor.variable).toBe("j");
        expect(innerFor.body).toHaveLength(1);
    });
    
});