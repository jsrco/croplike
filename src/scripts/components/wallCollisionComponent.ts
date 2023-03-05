import { Component } from './Component'
import { World } from "../util/World"

export class WallCollisionComponent extends Component {
    force: number = 3
    isHanging: boolean = false
    isSliding: boolean = false
    type: string = 'wallCollision'
    wallSlideSpeed: number = 0.2

    constructor(world: World) {
        super(world)
        this.world.eventManager.subscribe('gravityChange', this.onGravityChange.bind(this))
    }
    private onGravityChange(data: any): void {
        if (data.entity === this.owner) {
            this.isHanging = false
            this.isSliding = false
        }
    }
    setIsHanging(isIt: boolean) {
        this.isHanging = isIt
    }
    setIsSliding(isIt: boolean) {
        this.isSliding = isIt
    }
}
