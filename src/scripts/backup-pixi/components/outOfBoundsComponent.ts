import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class OutOfBoundsComponent extends Component {
    type: string = 'outOfBounds'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }
}
