import { PriorityQueue, HashTable, CircularQueue } from './index';

// Example usage and basic tests

console.log('Testing Priority Queue:');
const pq = new PriorityQueue<number>();
pq.enqueue(3);
pq.enqueue(1);
pq.enqueue(4);
pq.enqueue(1);
pq.enqueue(5);
console.log('Dequeue:', pq.dequeue()); // 1
console.log('Dequeue:', pq.dequeue()); // 1
console.log('Peek:', pq.peek()); // 3

console.log('\nTesting Hash Table:');
const ht = new HashTable<string, number>();
ht.put('one', 1);
ht.put('two', 2);
ht.put('three', 3);
console.log('Get one:', ht.get('one')); // 1
console.log('Contains two:', ht.containsKey('two')); // true
console.log('Size:', ht.getSize()); // 3

console.log('\nTesting Circular Queue:');
const cq = new CircularQueue<number>(5);
cq.enqueue(1);
cq.enqueue(2);
cq.enqueue(3);
console.log('Dequeue:', cq.dequeue()); // 1
console.log('Peek:', cq.peek()); // 2
console.log('Size:', cq.getSize()); // 2
console.log('To Array:', cq.toArray()); // [2, 3]