import { EventManager } from "./event-manager"

export class KeyboardController {

  eventManager: EventManager
  keysDown: { [key: string]: boolean }

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager
    this.keysDown = {}
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.keysDown[event.key] = true
    const data = { key: event.key, isDown: true }
    this.eventManager.dispatch('keyChange', data)
  }

  handleKeyUp(event: KeyboardEvent): void {
    this.keysDown[event.key] = false
    const data = { key: event.key, isDown: false }
    this.eventManager.dispatch('keyChange', data)
  }

  isKeyDown(key: string): boolean {
    return this.keysDown[key] === true
  }

}
