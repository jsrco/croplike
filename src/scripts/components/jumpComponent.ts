import { Component } from './Component'
import { World } from '../util/World'

export class JumpComponent extends Component {
  force: number = 5
  isJumping: boolean = false
  type = 'jump'

  constructor(world: World) {
    super(world)
    this.world.eventManager.subscribe('gravityChange', this.onGravityChange.bind(this))
  }
  private onGravityChange(data: any): void {
    if (data.entity === this.owner && data.gravityComponent.isOnGround) {
      this.setIsJumping(false)
    }
  }
  setIsJumping(isIt: boolean) {
    this.isJumping = isIt
    this.world.eventManager.dispatch('jumpChange', { entity: this.owner, jumpComponent: this })
  }
}