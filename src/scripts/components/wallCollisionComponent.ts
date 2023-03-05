import { Component } from './Component'
import { World } from "../util/World"

export class WallCollisionComponent extends Component {
    force: number = 3
    isSliding: boolean = false
    type: string = 'wallCollision'
    wallDirection: string = ''
    wallSlideSpeed: number = 1

    constructor(world: World) {
        super(world)
    }
    setIsSliding(isIt: boolean, direction?: string) {
        this.isSliding = isIt
        if (direction) this.wallDirection = direction
    }
    setWallSlideSpeed(newSpeed: number) {
        if (!this.isSliding) {
            this.wallSlideSpeed = 1
        } else this.wallSlideSpeed = Math.max(newSpeed, 0)
    }
}
