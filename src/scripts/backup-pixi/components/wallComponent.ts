import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class WallComponent extends Component {
    isWall: boolean = true
    type: string = 'wall'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }
}
