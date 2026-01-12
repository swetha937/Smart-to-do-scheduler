/**
 * Advanced Priority Queue Implementation using Min-Heap
 * Supports custom comparators, decrease-key operations, and efficient insertions/deletions
 */

export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    // Default to min-heap (smaller values have higher priority)
    this.comparator = comparator || ((a: any, b: any) => a - b);
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number): void {
    while (index > 0 && this.comparator(this.heap[index], this.heap[this.parent(index)]) < 0) {
      this.swap(index, this.parent(index));
      index = this.parent(index);
    }
  }

  private heapifyDown(index: number): void {
    const size = this.heap.length;
    let smallest = index;
    const left = this.leftChild(index);
    const right = this.rightChild(index);

    if (left < size && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
      smallest = left;
    }
    if (right < size && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  enqueue(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const root = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return root;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  // Advanced feature: decrease key for Dijkstra's algorithm etc.
  decreaseKey(oldItem: T, newItem: T): boolean {
    const index = this.heap.indexOf(oldItem);
    if (index === -1) return false;

    if (this.comparator(newItem, oldItem) >= 0) return false; // Not decreasing

    this.heap[index] = newItem;
    this.heapifyUp(index);
    return true;
  }

  // Convert to sorted array (destructive)
  toSortedArray(): T[] {
    const result: T[] = [];
    while (!this.isEmpty()) {
      result.push(this.dequeue()!);
    }
    return result;
  }

  // Non-destructive peek at k smallest elements
  peekTopK(k: number): T[] {
    if (k >= this.size()) return [...this.heap];

    const tempHeap = [...this.heap];
    const result: T[] = [];
    for (let i = 0; i < k; i++) {
      result.push(tempHeap[0]);
      // Simple heapify down on temp array
      const last = tempHeap.pop()!;
      if (tempHeap.length > 0) {
        tempHeap[0] = last;
        this.heapifyDownTemp(tempHeap, 0);
      }
    }
    return result;
  }

  private heapifyDownTemp(heap: T[], index: number): void {
    const size = heap.length;
    let smallest = index;
    const left = this.leftChild(index);
    const right = this.rightChild(index);

    if (left < size && this.comparator(heap[left], heap[smallest]) < 0) {
      smallest = left;
    }
    if (right < size && this.comparator(heap[right], heap[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== index) {
      [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
      this.heapifyDownTemp(heap, smallest);
    }
  }
}