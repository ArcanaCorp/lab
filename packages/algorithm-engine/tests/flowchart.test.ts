import { describe, expect, it } from "vitest";
import { tokenize, parse, buildFlowchart } from "../src";

describe("Flowchart Builder", () => {
    
    it("builds a flowchart from a program", () => {
        const source = `
            Algoritmo Hola

                Definir nombre Como Caracter
                Leer nombre
                Escribir "Hola"

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const flowchart = buildFlowchart(program);

        expect(flowchart.nodes).toHaveLength(5);

        expect(flowchart.nodes[0]).toMatchObject({type: "start", label: "Hola"});

        expect(flowchart.nodes.at(-1)).toMatchObject({type: "end", label: "Fin"});

        expect(flowchart.edges).toHaveLength(4);
    });

    it("builds branches for if statement", () => {
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

        const flowchart = buildFlowchart(program);

        const decision = flowchart.nodes.find(
            node => node.type === "decision"
        );

        expect(decision).toBeDefined();

        expect(decision?.label).toBe(
            "edad >= 18"
        );

        const decisionEdges = flowchart.edges.filter(edge => edge.source === decision?.id);

        expect(decisionEdges).toHaveLength(2);

        expect(
            decisionEdges.some(edge => edge.label === "Sí")
        ).toBe(true);

        expect(
            decisionEdges.some(edge => edge.label === "No")
        ).toBe(true);
    });

    it("builds a loop for while statement", () => {
    
        const source = `
            Algoritmo Contador

                Mientras contador <= 10 Hacer
                    Escribir contador
                    contador <- contador + 1
                FinMientras

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const flowchart = buildFlowchart(program);

        const decision = flowchart.nodes.find(
            node => node.type === "decision"
        );

        expect(decision).toBeDefined();

        expect(decision?.label).toBe("contador <= 10");

        const outgoingEdges = flowchart.edges.filter(edge => edge.source === decision?.id);

        expect(outgoingEdges).toHaveLength(2);

        expect(
            outgoingEdges.some(
                edge => edge.label === "Sí"
            )
        ).toBe(true);

        expect(
            outgoingEdges.some(
                edge => edge.label === "No"
            )
        ).toBe(true);

        const loopBack = flowchart.edges.find(
            edge =>
            edge.target === decision?.id &&
            edge.source !== decision?.id
        );

        expect(loopBack).toBeDefined();
    });

    it("builds nested if inside while", () => {
        
        const source = `
            Algoritmo Test

                Mientras contador <= 10 Hacer

                    Si contador % 2 = 0 Entonces
                        Escribir "Par"
                    SiNo
                        Escribir "Impar"
                    FinSi

                    contador <- contador + 1

                FinMientras

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));

        const flowchart = buildFlowchart(program);

        const decisions = flowchart.nodes.filter(
            node => node.type === "decision"
        );

        expect(decisions).toHaveLength(2);

        expect(
            decisions.some(
                node => node.label === "contador <= 10"
            )
        ).toBe(true);

        expect(
            decisions.some(
                node => node.label === "contador % 2 = 0"
            )
        ).toBe(true);

        const whileDecision = decisions.find(
            node => node.label === "contador <= 10"
        );

        expect(whileDecision).toBeDefined();

        const loopBack = flowchart.edges.find(
            edge =>
            edge.target === whileDecision?.id &&
            edge.source !== whileDecision?.id
        );

        expect(loopBack).toBeDefined();
    });

    it("builds flowchart for for statement", () => {
        const source = `
            Algoritmo Contador

                Para i <- 1 Hasta 10 Hacer
                    Escribir i
                FinPara

            FinAlgoritmo
        `;

        const program = parse(tokenize(source));
        const flowchart = buildFlowchart(program);

        expect(flowchart.nodes.length).toBeGreaterThan(0);

        const types = flowchart.nodes.map(node => node.type);

        expect(types).toContain("process");
        expect(types).toContain("decision");
    });

});