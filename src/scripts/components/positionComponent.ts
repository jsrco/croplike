import { Component } from "./Component"
import { World } from "../util/World"

export class PositionComponent extends Component {
    previousPosition: { x:number, y:number}
    type: string = 'position'
    x: number = 0
    y: number = 0

    constructor(world: World) {
        super(world)
        this.previousPosition = { x: this.x, y: this.y}
    }
    setPosition(x: number, y: number) {
        this.previousPosition = { x: this.x, y: this.y}
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }
}