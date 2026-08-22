let nextId = 0;

export function createNodeId(): string {
    nextId += 1;
    return `node_${nextId}`;
}

export function resetNodeIds(): void {
    nextId = 0;
}