import * as PIXI from "pixi.js"
import { Rectangle } from "pixi.js"
import { Component } from "./Component"
import { World } from "../util/World"

export class CollisionComponent extends Component {
    rectangle: Rectangle
    type: string = 'collision'

    constructor(world: World) {
        super(world)
        this.rectangle = new PIXI.Rectangle(0,0,10,10)
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }
    private onSizeChange(data: any): void {
        if (data.entity === this.owner) {
            const sizeComponent = data.sizeComponent
            this.rectangle.height = sizeComponent.height
            this.rectangle.width = sizeComponent.width
        }
    }
}