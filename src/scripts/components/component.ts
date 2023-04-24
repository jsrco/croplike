import { Entity } from "../entities/Entity"
import { World } from "../util/World"

export class Component {
    owner!: Entity
    type!: string
    world: World

    constructor(world: World) {
        this.world = world
    }
}