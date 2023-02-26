import { Component } from './Component'
import { World } from "../util/World"

export class GravityComponent extends Component {
    public force: number = 0.6
    isOnGround: boolean = false
    type = 'gravity'
    
    constructor(world: World) {
        super(world)
    }
    setGravity(x: number) {
        this.force = x
    }
    setGroundStatus(isIt: boolean) {
        this.isOnGround = isIt
    }
}
