import { Vector2 } from "@dimforge/rapier2d"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class SizeComponent extends Component {

    maxSize: number
    size: Vector2 = new Vector2(0, 0)
    type: string = 'size'

    constructor(entity: Entity, world: World, options: { maxSize?: number, size: Vector2 }) {
        super(entity, world)
        const { maxSize, size } = options
        this.maxSize = maxSize || 200
        this.setSize(size)
    }

    setSize(size: Vector2) {
        this.size = size
        this.world.eventManager.dispatch('sizeChange', { entity: this.owner, sizeComponent: this })
    }

}