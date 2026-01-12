/**
 * Advanced Hash Table Implementation with Chaining
 * Features: Dynamic resizing, load factor management, collision handling, custom hash functions
 */

export class HashTable<K, V> {
  private buckets: Array<Array<{ key: K; value: V }>> = [];
  private size: number = 0;
  private capacity: number;
  private loadFactor: number;
  private hashFunction: (key: K) => number;

  constructor(
    initialCapacity: number = 16,
    loadFactor: number = 0.75,
    hashFunction?: (key: K) => number
  ) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.hashFunction = hashFunction || this.defaultHash;
  }

  private defaultHash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getBucketIndex(key: K): number {
    return this.hashFunction(key) % this.capacity;
  }

  private resize(newCapacity: number): void {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;

    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        this.put(entry.key, entry.value);
      }
    }
  }

  private shouldResize(): boolean {
    return this.size / this.capacity > this.loadFactor;
  }

  put(key: K, value: V): void {
    if (this.shouldResize()) {
      this.resize(this.capacity * 2);
    }

    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    for (const entry of bucket) {
      if (this.keysEqual(entry.key, key)) {
        entry.value = value;
        return;
      }
    }

    bucket.push({ key, value });
    this.size++;
  }

  get(key: K): V | undefined {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    for (const entry of bucket) {
      if (this.keysEqual(entry.key, key)) {
        return entry.value;
      }
    }
    return undefined;
  }

  remove(key: K): V | undefined {
    const index = this.getBucketIndex(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (this.keysEqual(bucket[i].key, key)) {
        const removed = bucket.splice(i, 1)[0];
        this.size--;
        return removed.value;
      }
    }
    return undefined;
  }

  containsKey(key: K): boolean {
    return this.get(key) !== undefined;
  }

  getSize(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  clear(): void {
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
  }

  // Advanced features
  keys(): K[] {
    const result: K[] = [];
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        result.push(entry.key);
      }
    }
    return result;
  }

  values(): V[] {
    const result: V[] = [];
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        result.push(entry.value);
      }
    }
    return result;
  }

  entries(): Array<{ key: K; value: V }> {
    const result: Array<{ key: K; value: V }> = [];
    for (const bucket of this.buckets) {
      result.push(...bucket);
    }
    return result;
  }

  // Custom equality function (can be overridden for complex keys)
  private keysEqual(a: K, b: K): boolean {
    return a === b;
  }

  // Set custom equality function
  setKeyEqualityFunction(equalityFn: (a: K, b: K) => boolean): void {
    this.keysEqual = equalityFn;
  }

  // Get load factor
  getLoadFactor(): number {
    return this.size / this.capacity;
  }

  // Manual rehash
  rehash(): void {
    this.resize(this.capacity);
  }

  // Get bucket sizes for analysis
  getBucketSizes(): number[] {
    return this.buckets.map(bucket => bucket.length);
  }

  // Compute hash for debugging
  computeHash(key: K): number {
    return this.hashFunction(key);
  }
}