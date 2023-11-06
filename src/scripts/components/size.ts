import { Vector2 } from "@dimforge/rapier2d"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class SizeComponent extends Component {

    size: Vector2 = { x: 0, y: 0 }
    type: string = 'size'

    constructor(entity: Entity, world: World, options: { size: Vector2 }) {
        super(entity, world)
        const { size } = options
        this.setSize(size)
    }

    setSize(size: Vector2) {
        this.size = size
        this.world.eventManager.dispatch('sizeChange', { entity: this.owner, sizeComponent: this })
    }

}