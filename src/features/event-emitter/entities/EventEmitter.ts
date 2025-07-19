type ToArray<T> = T extends any[] ? T : [ T ];

export default class EventEmitter<Args = []> {

  private callbacks: Array<(...args: ToArray<Args>) => void> = []

  public add(callback: (...args: ToArray<Args>) => void) {
    this.callbacks.push(callback)
  }

  public remove(callback: (...args: ToArray<Args>) => void) {
    const index = this.callbacks.indexOf(callback)
    
    if (index != -1) {
      this.callbacks.splice(index, 1)
    }
  }

  public trigger(...args: ToArray<Args>) {
    for (const callback of this.callbacks) {
      callback(...args)
    }
  }
}

