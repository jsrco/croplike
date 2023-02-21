import { EventManager } from './EventManager'

class KeyboardController {
  private eventManager: EventManager

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager

    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const data = { key: event.key, isDown: true }
    this.eventManager.dispatch('keyChange', data)
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const data = { key: event.key, isDown: false }
    this.eventManager.dispatch('keyChange', data)
  }
}
