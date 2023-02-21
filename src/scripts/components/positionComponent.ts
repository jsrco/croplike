import { Component } from "./component"
import { EventManager } from "../util/EventManager"

export class PositionComponent extends Component {
    x: number = 0
    y: number = 0
    type: string = 'position'
    constructor(eventManager: EventManager) {
        super(eventManager)
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
        this.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }
}