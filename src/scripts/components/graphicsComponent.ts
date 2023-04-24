import * as PIXI from "pixi.js"
import { Graphics } from "pixi.js"
import { Component } from "."
import { World } from "../util/World"

export class GraphicsComponent extends Component {
    rectangle: Graphics
    type: string = 'graphics'

    constructor(world: World, color = 0xFF0000) {
        super(world)
        this.rectangle = new PIXI.Graphics().beginFill(color).drawRect(0, 0, 10, 10)

        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }
    addToStage() {
        this.world.app.stage.addChild(this.rectangle)
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
    removeFromStage() {
        this.world.app.stage.removeChild(this.rectangle)
    }
}