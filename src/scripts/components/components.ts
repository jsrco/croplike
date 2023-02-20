import * as PIXI from "pixi.js"
import { Component } from "./component"

export class PositionComponent extends Component {
    position: PIXI.Point
    type: string = 'position'
    
    constructor(x: number, y: number) {
        super()
        this.position = new PIXI.Point(x, y)
    }
}