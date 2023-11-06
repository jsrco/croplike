import { Vector2 } from "@dimforge/rapier2d"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class PositionComponent extends Component {

    position: Vector2 = { x: 0, y: 0 }
    type: string = 'position'

    constructor(entity: Entity, world: World, options: { position: Vector2 }) {
        super(entity, world)
        const { position } = options
        this.setSize(position)
    }

    setSize(position: Vector2) {
        this.position = position
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }

}