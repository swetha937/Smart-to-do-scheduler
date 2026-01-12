class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  data: any[] = []; // Store associated data (e.g., task IDs)
}

export class Trie {
  private root: TrieNode = new TrieNode();

  insert(word: string, data?: any): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEndOfWord = true;
    if (data !== undefined) {
      node.data.push(data);
    }
  }

  search(word: string): any[] {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    return node.isEndOfWord ? node.data : [];
  }

  startsWith(prefix: string): any[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    return this.collectAllData(node);
  }

  private collectAllData(node: TrieNode): any[] {
    let results: any[] = [...node.data];

    for (const child of node.children.values()) {
      results = results.concat(this.collectAllData(child));
    }

    return results;
  }

  // Advanced search with fuzzy matching (simple implementation)
  fuzzySearch(word: string, maxDistance: number = 1): any[] {
    const results: any[] = [];
    this.fuzzySearchHelper(this.root, word.toLowerCase(), '', 0, maxDistance, results);
    return results;
  }

  private fuzzySearchHelper(
    node: TrieNode,
    target: string,
    current: string,
    index: number,
    maxDistance: number,
    results: any[]
  ): void {
    if (index === target.length) {
      if (node.isEndOfWord && current.length - target.length <= maxDistance) {
        results.push(...node.data);
      }
      return;
    }

    for (const [char, childNode] of node.children) {
      const distance = current.length - index;
      if (distance > maxDistance) continue;

      if (char === target[index]) {
        this.fuzzySearchHelper(childNode, target, current + char, index + 1, maxDistance, results);
      } else if (distance < maxDistance) {
        // Allow one character difference
        this.fuzzySearchHelper(childNode, target, current + char, index + 1, maxDistance, results);
      }
    }
  }
}