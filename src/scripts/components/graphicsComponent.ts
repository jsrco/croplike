import * as PIXI from "pixi.js"
import { Graphics } from "pixi.js"
import { Component } from "./Component"
import { EventManager } from "../util/EventManager"
import { PositionComponent, SizeComponent } from "./index"

export class GraphicsComponent extends Component {
    rectangle: Graphics
    positionComponent: PositionComponent
    sizeComponent: SizeComponent
    type: string = 'graphics'

    constructor(eventManager: EventManager, positionComponent: PositionComponent, sizeComponent: SizeComponent, color = 0xFF0000) {
        const { x, y } = positionComponent
        const { height, width } = sizeComponent
        super(eventManager)
        this.rectangle = new PIXI.Graphics().beginFill(color).drawRect(x, y, width, height)
        this.positionComponent = positionComponent
        this.sizeComponent = sizeComponent

        this.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))

    }
    private onPositionChange(data: any): void {
        if (data.entity === this.owner) {
            const positionComponent = data.positionComponent
            this.rectangle.x = positionComponent.x
            this.rectangle.y = positionComponent.y
        }
    }
    private onSizeChange(data: any): void {
        if (data.entity === this.owner) {
            const sizeComponent = data.sizeComponent
            this.rectangle.height = sizeComponent.height
            this.rectangle.width = sizeComponent.width
        }
    }
}