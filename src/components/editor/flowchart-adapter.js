export function flowchartToReactFlow(flowchart) {

    if (!flowchart) {
        return {
            nodes: [],
            edges: []
        };
    }

    const nodes = flowchart.nodes.map((node, index) => ({
        id: node.id,

        position: {
            x: 0,
            y: index * 120
        },

        data: {
            label: node.label
        },

        type: "default"
    }));

    const edges = flowchart.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label
    }));

    return {
        nodes,
        edges
    };
}