export class Engine {

    running: boolean = false

    constructor() {    
    }

    addCanvas(elementRef: HTMLElement) {
        console.log("still loading.")
    }

    startRun(): void {
        this.running = true
    }

    stopRun(): void {
        this.running = false
    }

    update(delta: number): void {
        if (this.running) console.log('Game is running')
    }

}
