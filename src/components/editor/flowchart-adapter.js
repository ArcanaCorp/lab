import FlowchartNode from "./flowchart/FlowchartNode";
import DecisionNode from "./flowchart/DecisionNode";

const nodeTypes = {
    flowchart: FlowchartNode,
    decision: DecisionNode
};

export function flowchartToReactFlow(flowchart) {

    const visibleNodes = flowchart.nodes.filter(
        node => node.type !== "merge"
    );

    /*
     * =========================
     * POSICIONES
     * =========================
     */

    const positions = new Map();

    const startNode = visibleNodes.find(
        node => node.type === "start"
    );

    const decisionNodes = visibleNodes.filter(
        node => node.type === "decision"
    );

    const normalNodes = visibleNodes.filter(
        node =>
            node.type !== "start" &&
            node.type !== "end" &&
            node.type !== "decision"
    );

    /*
     * Posición vertical inicial
     */
    let y = 0;

    /*
     * START
     */
    if (startNode) {
        positions.set(startNode.id, {
            x: 300,
            y
        });

        y += 150;
    }

    /*
     * Procesamos las decisiones.
     *
     * Cuando encontramos un IF:
     *
     *              DECISIÓN
     *              /      \
     *            NO        SÍ
     *           /            \
     *
     * El Sí queda a la derecha
     * El No queda a la izquierda.
     */

    for (const decision of decisionNodes) {

        positions.set(decision.id, {
            x: 300,
            y
        });

        const outgoing = flowchart.edges.filter(
            edge => edge.source === decision.id
        );

        const yesEdge = outgoing.find(
            edge => edge.label === "Sí"
        );

        const noEdge = outgoing.find(
            edge => edge.label === "No"
        );

        /*
         * Rama Sí
         */
        if (yesEdge) {
            const yesNode = findVisibleTarget(
                yesEdge.target,
                flowchart,
                visibleNodes
            );

            if (yesNode) {
                positions.set(yesNode.id, {
                    x: 550,
                    y: y + 180
                });
            }
        }

        /*
         * Rama No
         */
        if (noEdge) {
            const noNode = findVisibleTarget(
                noEdge.target,
                flowchart,
                visibleNodes
            );

            if (noNode) {
                positions.set(noNode.id, {
                    x: 50,
                    y: y + 180
                });
            }
        }

        y += 330;
    }

    /*
     * Los nodos que todavía no tienen posición
     * se colocan debajo.
     */
    for (const node of normalNodes) {

        if (positions.has(node.id)) {
            continue;
        }

        positions.set(node.id, {
            x: 300,
            y
        });

        y += 130;
    }

    /*
     * END
     */
    const endNode = visibleNodes.find(
        node => node.type === "end"
    );

    if (endNode) {
        positions.set(endNode.id, {
            x: 300,
            y
        });
    }

    /*
     * =========================
     * NODOS REACT FLOW
     * =========================
     */

    const nodes = visibleNodes.map(node => {

        const position = positions.get(node.id) || {
            x: 300,
            y: 0
        };

        return {
            id: node.id,

            position,

            data: {
                label: node.label
            },

            /*
             * IMPORTANTE:
             *
             * React Flow debe saber qué componente
             * utilizar para cada tipo.
             */
            type:
                node.type === "decision"
                    ? "decision"
                    : "flowchart",

            className: `flowchart-node flowchart-${node.type}`
        };
    });

    /*
     * =========================
     * EDGES
     * =========================
     */

    const visibleNodeIds = new Set(
        visibleNodes.map(node => node.id)
    );

    function resolveTarget(nodeId, visited = new Set()) {

        if (visited.has(nodeId)) {
            return null;
        }

        visited.add(nodeId);

        if (visibleNodeIds.has(nodeId)) {
            return nodeId;
        }

        const outgoing = flowchart.edges.filter(
            edge => edge.source === nodeId
        );

        for (const edge of outgoing) {

            const target = resolveTarget(
                edge.target,
                visited
            );

            if (target) {
                return target;
            }
        }

        return null;
    }

    const edges = [];

    for (const edge of flowchart.edges) {

        const source = resolveTarget(edge.source);
        const target = resolveTarget(edge.target);

        if (!source || !target) {
            continue;
        }

        if (source === target) {
            continue;
        }

        edges.push({
            id: edge.id,

            source,
            target,

            label: edge.label,

            type: "smoothstep",

            animated: false
        });
    }

    return {
        nodes,
        edges
    };
}


/*
 * Busca el primer nodo visible
 * siguiendo una cadena de nodos merge.
 */
function findVisibleTarget(
    nodeId,
    flowchart,
    visibleNodes
) {

    const visibleIds = new Set(
        visibleNodes.map(node => node.id)
    );

    const visited = new Set();

    function search(id) {

        if (visited.has(id)) {
            return null;
        }

        visited.add(id);

        if (visibleIds.has(id)) {
            return visibleNodes.find(
                node => node.id === id
            );
        }

        const outgoing = flowchart.edges.filter(
            edge => edge.source === id
        );

        for (const edge of outgoing) {

            const result = search(edge.target);

            if (result) {
                return result;
            }
        }

        return null;
    }

    return search(nodeId);
}