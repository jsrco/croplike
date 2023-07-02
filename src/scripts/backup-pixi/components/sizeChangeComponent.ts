import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class SizeChangeComponent extends Component {
    isShrinking: boolean = false
    isSizeChanger: boolean = true
    maxHeight: number = 200
    type: string = 'sizeChange'

    constructor(entity: Entity, world: World) {
        super(entity, world)
    }
    setIsShrinking(isIt: boolean) {
        this.isShrinking = isIt
    }
}
