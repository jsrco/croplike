import { Entity } from "../entities/Entity"
import { Component } from "."
import { World } from "../util/World"

export class WallComponent extends Component {
    isMobile: boolean = false
    isWall: boolean = true
    type: string = 'wall'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }
}
