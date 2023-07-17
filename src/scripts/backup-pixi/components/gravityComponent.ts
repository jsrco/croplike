import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class GravityComponent extends Component {
    force: number = 0.5
    isOnGround: boolean = false
    isRiding: boolean = false
    type: string = 'gravity'

    constructor(entity: Entity, world: World, force?: number) {
        super(entity, world)
        if (force) this.setGravity(force)
    }
    setGravity(x: number) {
        this.force = x
    }
    setGroundStatus(isIt: boolean) {
        this.isOnGround = isIt
        this.world.eventManager.dispatch('gravityChange', { entity: this.owner, gravityComponent: this })
    }
    setRidingStatus(isIt: boolean) {
        this.isRiding = isIt
        this.world.eventManager.dispatch('gravityChange', { entity: this.owner, gravityComponent: this })
    }
}