/**
 * Advanced Circular Queue Implementation
 * Features: Fixed capacity, efficient enqueue/dequeue, bulk operations, iterator support
 */

export class CircularQueue<T> {
  private queue: (T | undefined)[] = [];
  private front: number = 0;
  private rear: number = 0;
  private size: number = 0;
  private capacity: number;

  constructor(capacity: number = 1000) {
    this.capacity = capacity;
    this.queue = new Array(capacity).fill(undefined);
  }

  enqueue(item: T): boolean {
    if (this.isFull()) {
      return false; // Queue is full
    }

    this.queue[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
    return true;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.queue[this.front];
    this.queue[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.queue[this.front];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }

  getSize(): number {
    return this.size;
  }

  getCapacity(): number {
    return this.capacity;
  }

  clear(): void {
    this.queue.fill(undefined);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }

  // Advanced features

  // Resize the queue (creates new array)
  resize(newCapacity: number): void {
    if (newCapacity <= this.size) {
      throw new Error("New capacity must be larger than current size");
    }

    const newQueue: (T | undefined)[] = new Array(newCapacity).fill(undefined);
    for (let i = 0; i < this.size; i++) {
      newQueue[i] = this.queue[(this.front + i) % this.capacity];
    }

    this.queue = newQueue;
    this.front = 0;
    this.rear = this.size;
    this.capacity = newCapacity;
  }

  // Bulk enqueue
  enqueueMultiple(items: T[]): number {
    let enqueued = 0;
    for (const item of items) {
      if (this.enqueue(item)) {
        enqueued++;
      } else {
        break; // Stop if queue becomes full
      }
    }
    return enqueued;
  }

  // Bulk dequeue
  dequeueMultiple(count: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      const item = this.dequeue();
      if (item === undefined) break;
      result.push(item);
    }
    return result;
  }

  // Convert to array (non-destructive)
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.size; i++) {
      result.push(this.queue[(this.front + i) % this.capacity]!);
    }
    return result;
  }

  // Iterator support
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.size; i++) {
      yield this.queue[(this.front + i) % this.capacity]!;
    }
  }

  // Reverse iterator
  *reverseIterator(): Iterator<T> {
    for (let i = this.size - 1; i >= 0; i--) {
      yield this.queue[(this.front + i) % this.capacity]!;
    }
  }

  // Search for element
  contains(item: T, comparator?: (a: T, b: T) => boolean): boolean {
    const compare = comparator || ((a, b) => a === b);
    for (const element of this) {
      if (compare(element, item)) {
        return true;
      }
    }
    return false;
  }

  // Find index of element
  indexOf(item: T, comparator?: (a: T, b: T) => boolean): number {
    const compare = comparator || ((a, b) => a === b);
    let index = 0;
    for (const element of this) {
      if (compare(element, item)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  // Rotate queue by k positions
  rotate(k: number): void {
    if (this.isEmpty()) return;

    const rotations = ((k % this.size) + this.size) % this.size;
    if (rotations === 0) return;

    this.front = (this.front + rotations) % this.capacity;
  }

  // Get element at specific index
  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    return this.queue[(this.front + index) % this.capacity];
  }

  // Clone the queue
  clone(): CircularQueue<T> {
    const cloned = new CircularQueue<T>(this.capacity);
    cloned.queue = [...this.queue];
    cloned.front = this.front;
    cloned.rear = this.rear;
    cloned.size = this.size;
    return cloned;
  }
}