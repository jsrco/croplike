import { Component } from './Component'
import { World } from "../util/World"

export class GravityComponent extends Component {
    public force: number = 0.5
    isOnGround: boolean = false
    type = 'gravity'
    
    constructor(world: World) {
        super(world)
        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
    }
    private onPositionChange(data: any): void {
        if (data.entity === this.owner) {
            this.setGroundStatus(false)
        }
    }
    setGravity(x: number) {
        this.force = x
    }
    setGroundStatus(isIt: boolean) {
        this.isOnGround = isIt
        this.world.eventManager.dispatch('gravityChange', { entity: this.owner, gravityComponent: this })
    }
}
