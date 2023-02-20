import * as PIXI from "pixi.js"
import { Graphics } from "pixi.js"
import { Component } from "./component"

export class PositionComponent extends Component {
    x: number = 0
    y: number = 0
    type: string = 'position'

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
export class GraphicsComponent extends Component {
    rectangle: Graphics
    type: string = 'graphics'

    constructor(positionComponent: PositionComponent, sizeComponent: SizeComponent, color = 0xFF0000) {
        const { x, y } = positionComponent
        const { height, width } = sizeComponent
        super()
        this.rectangle = new PIXI.Graphics().beginFill(color).drawRect(x, y, width, height)
    }
}
export class SizeComponent extends Component {
    height: number
    width: number
    type: string = 'size'

    constructor(x: number, y?: number) {
        super()
        this.height = y || x
        this.width = x 
    }
}

