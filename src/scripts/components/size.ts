
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"


export class SizeComponent extends Component {

    height: number = 1
    width: number = 1
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

