import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class VelocityComponent extends Component {
    type: string = 'velocity'
    x: number = 0
    y: number = 0

    constructor(entity: Entity, world: World, x?: number, y?: number) {
        super(entity, world)
        if (x) this.setVelocityX(x)
        if (y) this.setVelocityY(y)
    }
    setVelocity(x: number, y: number) {
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('velocityChange', { entity: this.owner, velocityComponent: this })
    }
    setVelocityX(x: number) {
        this.x = x
        this.world.eventManager.dispatch('velocityChange', { entity: this.owner, velocityComponent: this })
    }
    setVelocityY(y: number) {
        this.y = y
        this.world.eventManager.dispatch('velocityChange', { entity: this.owner, velocityComponent: this })
    }
}