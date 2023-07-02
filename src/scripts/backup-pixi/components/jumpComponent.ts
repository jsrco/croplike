import { Component } from "."
import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class JumpComponent extends Component {
  force: number = 5
  isJumping: boolean = false
  type = 'jump'

  constructor(entity: Entity, world: World) {
    super(entity, world)
    this.world.eventManager.subscribe('gravityChange', this.onGravityChange.bind(this))
  }
  onGravityChange(data: any): void {
    if (data.entity === this.owner && (data.gravityComponent.isOnGround || data.gravityComponent.isRiding)) {
      this.setIsJumping(false)
    }
  }
  setIsJumping(isIt: boolean) {
    this.isJumping = isIt
    this.world.eventManager.dispatch('jumpChange', { entity: this.owner, jumpComponent: this })
  }
}