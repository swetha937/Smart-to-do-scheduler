export class Graph<T> {
  private adjacencyList: Map<T, T[]> = new Map();

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from: T, to: T): void {
    if (!this.adjacencyList.has(from)) {
      this.addVertex(from);
    }
    if (!this.adjacencyList.has(to)) {
      this.addVertex(to);
    }
    this.adjacencyList.get(from)!.push(to);
  }

  getNeighbors(vertex: T): T[] {
    return this.adjacencyList.get(vertex) || [];
  }

  hasCycle(): boolean {
    const visited = new Set<T>();
    const recStack = new Set<T>();

    const dfs = (vertex: T): boolean => {
      if (recStack.has(vertex)) return true;
      if (visited.has(vertex)) return false;

      visited.add(vertex);
      recStack.add(vertex);

      for (const neighbor of this.getNeighbors(vertex)) {
        if (dfs(neighbor)) return true;
      }

      recStack.delete(vertex);
      return false;
    };

    for (const vertex of this.adjacencyList.keys()) {
      if (dfs(vertex)) return true;
    }

    return false;
  }

  topologicalSort(): T[] {
    const visited = new Set<T>();
    const stack: T[] = [];

    const dfs = (vertex: T): void => {
      visited.add(vertex);
      for (const neighbor of this.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
      stack.push(vertex);
    };

    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        dfs(vertex);
      }
    }

    return stack.reverse();
  }

  getAllVertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }
}