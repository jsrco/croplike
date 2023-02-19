export class EventSystem {
    private listeners: { [event: string]: Function[] } = {}

    public addEventListener(event: string, callback: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
    }
    public dispatchEvent(event: string, data?: any): void {
        if (this.listeners[event]) {
            for (const listener of this.listeners[event]) {
                listener(data)
            }
        }
    }
    public removeEventListener(event: string, callback: Function): void {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback)
            if (index !== -1) {
                this.listeners[event].splice(index, 1)
            }
        }
    }
}
