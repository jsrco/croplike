import { Entity } from "../entities/Entity"
import { Component } from "."
import { World } from "../util/World"

export class SizeChangeComponent extends Component {
    isShrinking: boolean = false
    isSizeChanger: boolean = true
    type: string = 'sizeChange'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }
    setIsShrinking(isIt: boolean) {
        this.isShrinking = isIt
    }
}
