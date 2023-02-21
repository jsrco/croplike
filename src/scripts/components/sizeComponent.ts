
import { Component } from "./Component"
import { EventManager } from "../util/EventManager"


export class SizeComponent extends Component {
    height: number
    width: number
    type: string = 'size'

    constructor(eventManager: EventManager, x: number, y?: number) {
        super(eventManager)
        this.height = y || x
        this.width = x
    }

    setSize(x: number, y?: number) {
        this.height = y || x
        this.width = x
        this.eventManager.dispatch('sizeChange', { entity: this.owner, sizeComponent: this })
    }
}

