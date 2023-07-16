import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class PositionComponent extends Component {

    type: string = 'position'
    x: number = 0
    y: number = 0

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }

    setPosition(x: number, y: number) {
        this.previousPosition = { x: this.x, y: this.y }
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }

}