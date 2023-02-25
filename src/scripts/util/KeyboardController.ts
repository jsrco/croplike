import { EventManager } from './EventManager'

export class KeyboardController {
  private eventManager: EventManager
  private keysDown: { [key: string]: boolean }

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager
    this.keysDown = {}
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }
  private handleKeyDown(event: KeyboardEvent): void {
    this.keysDown[event.key] = true
    const data = { key: event.key, isDown: true }
    this.eventManager.dispatch('keyChange', data)
  }
  private handleKeyUp(event: KeyboardEvent): void {
    this.keysDown[event.key] = false
    const data = { key: event.key, isDown: false }
    this.eventManager.dispatch('keyChange', data)
  }
  public isKeyDown(key: string): boolean {
    return this.keysDown[key] === true
  }
}