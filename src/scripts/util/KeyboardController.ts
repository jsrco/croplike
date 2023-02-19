export class KeyboardController {
    private readonly keyState: Map<string, boolean> = new Map<string, boolean>()

    constructor() {
        window.addEventListener("keydown", this.onKeyDown.bind(this))
        window.addEventListener("keyup", this.onKeyUp.bind(this))
    }

    public addEventListener(eventType: string, listener: EventListenerOrEventListenerObject): void {
        window.addEventListener(eventType, listener)
    }
    public isKeyDown(key: string): boolean {
        return this.keyState.get(key) ?? false
    }
    private onKeyDown(event: KeyboardEvent): void {
        this.keyState.set(event.code, true)
    }
    private onKeyUp(event: KeyboardEvent): void {
        this.keyState.set(event.code, false)
    }
    public removeEventListener(eventType: string, listener: EventListenerOrEventListenerObject): void {
        window.removeEventListener(eventType, listener)
    }
}


/*
// This creates a new KeyboardController object that listens for keyboard inputs.
// Update the player's velocity based on keyboard inputs. 
// In the update method of the PlayerMovementSystem class, update the velocity of the player entity based on keyboard inputs.
public update(delta: number): void {
  for (const entity of this.entities) {
    const position = entity.getComponent<PositionComponent>("position")
    const velocity = entity.getComponent<VelocityComponent>("velocity")
    if (keyboardController.isKeyDown("ArrowLeft")) {
      velocity.x = -200
    } else if (keyboardController.isKeyDown("ArrowRight")) {
      velocity.x = 200
    } else {
      velocity.x = 0
    }
    if (keyboardController.isKeyDown("ArrowUp")) {
      velocity.y = -200
    } else if (keyboardController.isKeyDown("ArrowDown")) {
      velocity.y = 200
    } else {
      velocity.y = 0
    }
  }
}
*/