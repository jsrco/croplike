import { Component } from "./Component"
import { EventManager } from "../util/EventManager"

export class PositionComponent extends Component {
    x: number = 0
    y: number = 0
    type: string = 'position'
    constructor(eventManager: EventManager) {
        super(eventManager)

        this.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }

    private onKeyChange(data: any): void {
        if (data.isDown) {
            console.log(data)
            if (data.key === 'ArrowLeft') {
                this.setPosition(this.x - 1, this.y)
            } else if (data.key === 'ArrowRight') {
                this.setPosition(this.x + 1, this.y)
            }
        }
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
        this.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }
}