export class EventManager {
  private eventListeners: { [eventType: string]: Function[] } = {};

  public dispatch(eventType: string, data?: any): void {
    if (!this.eventListeners[eventType]) {
      return
    }
    this.eventListeners[eventType].forEach((listener) => {
      listener(data)
    })
  }
  public subscribe(eventType: string, listener: Function): void {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = []
    }
    this.eventListeners[eventType].push(listener)
  }
  public unsubscribe(eventType: string, listener: Function): void {
    if (!this.eventListeners[eventType]) {
      return
    }
    const index = this.eventListeners[eventType].indexOf(listener)
    if (index >= 0) {
      this.eventListeners[eventType].splice(index, 1)
    }
  }
}