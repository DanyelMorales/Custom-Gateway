export interface IPriorityQueue<T> {
  add(value: T, priority: number): IPriorityQueue<T>;
  clearAll(): void;
  remove(value: T): IPriorityQueue<T>;
  get(): any;
  isEmpty(): boolean;
}

export class PriorityQueue<T> implements IPriorityQueue<T> {
  private collection: any[] = [];

  private orderMe(a: any, b: any): number {
    return b.priority - a.priority;
  }

  add(value: T, priority: number): PriorityQueue<T> {
    const map = {
      priority: priority,
      value: value
    };
    this.collection.push(map);
    this.collection.sort(this.orderMe);
    return this;
  }

  clearAll(): void {
    delete this.collection;
    this.collection = [];
  }

  remove(value: T): PriorityQueue<T> {
    for (const i in this.collection) {
      if (this.collection[i].value === value) {
        delete this.collection[i];
      }
    }
    return this;
  }

  get(): T[] {
    if (this.collection.length === 0) {
      return null;
    }
    const container = [];
    this.collection.forEach(element => {
      container.push(element.value);
    });
    return container;
  }

  isEmpty(): boolean {
    return this.collection.length === 0;
  }
}
