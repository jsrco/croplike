import { Component } from "."
import { World } from "../util/World"

export class VelocityComponent extends Component {
    type: string = 'velocity'
    x: number = 0
    y: number = 0

    constructor(world: World) {
        super(world)
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