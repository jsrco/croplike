import { Vector2 } from "@dimforge/rapier2d"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class PositionComponent extends Component {

    position: Vector2 = new Vector2(0, 0)
    targetPosition: Vector2 = new Vector2(0, 0)
    type: string = 'position'

    constructor(entity: Entity, world: World, options: { position: Vector2 }) {
        super(entity, world)
        const { position } = options
        this.setPosition(position)
        this.setTargetPosition(position)
    }

    canSetTargetPosition(position: Vector2): boolean {
        this.targetPosition = position
        if (this.world.isOkToPlace(this.owner)) {
            return true
        }
        this.targetPosition = this.position
        return false
    }
    
    setPosition(position: Vector2) {
        this.position = position
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }

    setTargetPosition(position: Vector2) {
        this.targetPosition = position
    }

}