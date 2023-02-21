import * as PIXI from "pixi.js"
import { Graphics } from "pixi.js"
import { Component } from "./Component"
import { PositionComponent, SizeComponent } from "./index"
import { World } from "../util/World"

export class GraphicsComponent extends Component {
    rectangle: Graphics
    positionComponent: PositionComponent
    sizeComponent: SizeComponent
    type: string = 'graphics'

    constructor(world: World, positionComponent: PositionComponent, sizeComponent: SizeComponent, color = 0xFF0000) {
        const { x, y } = positionComponent
        const { height, width } = sizeComponent
        super(world)
        this.rectangle = new PIXI.Graphics().beginFill(color).drawRect(x, y, width, height)
        this.positionComponent = positionComponent
        this.sizeComponent = sizeComponent

        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))

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