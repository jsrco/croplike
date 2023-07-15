import { Component } from "./Component"
import { World } from "../util/World"
import { Entity } from "../entities/Entity"

export class PositionComponent extends Component {

    previousPosition: { x: number, y: number }
    type: string = 'position'
    x: number = 0
    y: number = 0

    constructor(entity: Entity, world: World, x: number, y: number) {
        super(entity, world)
        this.previousPosition = { x: this.x, y: this.y }
        this.setPosition(x, y)
    }

    setPosition(x: number, y: number) {
        this.previousPosition = { x: this.x, y: this.y }
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }

}