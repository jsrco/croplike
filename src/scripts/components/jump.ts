import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class JumpComponent extends Component {

    force: number = 5
    isJumping: boolean = false
    type = 'jump'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }

    setIsJumping(isIt: boolean) {
        this.isJumping = isIt
        this.world.eventManager.dispatch('jumpChange', { entity: this.owner, jumpComponent: this })
    }

}