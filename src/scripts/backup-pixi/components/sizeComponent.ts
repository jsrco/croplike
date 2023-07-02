
import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"


export class SizeComponent extends Component {
    height: number = 10
    width: number = 10
    type: string = 'size'

    constructor(entity: Entity, world: World, x?: number, y?: number) {
        super(entity, world)
        this.setSize(x || this.width, y || x || this.height)
    }
    setSize(x: number, y?: number) {
        this.height = y || x
        this.width = x
        this.world.eventManager.dispatch('sizeChange', { entity: this.owner, sizeComponent: this })
    }
}

