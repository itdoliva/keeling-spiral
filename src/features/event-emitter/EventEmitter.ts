export class EventEmitter<Args extends any[] = []> {

  private callbacks: Array<(...args: Args) => void> = []

  public add(callback: (...args: Args) => void) {
    this.callbacks.push(callback)
  }

  public remove(callback: (...args: Args) => void) {
    const index = this.callbacks.indexOf(callback)
    
    if (index != -1) {
      this.callbacks.splice(index, 1)
    }
  }

  public trigger(...args: Args) {
    for (const callback of this.callbacks) {
      callback(...args)
    }
  }
}