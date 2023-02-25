import { Component } from './Component'
import { World } from "../util/World"

export class GravityComponent extends Component {
    public force: number = 0
    type = 'gravity'
    
    constructor(world: World) {
        super(world)
    }
    setGravity(x: number) {
        this.force = x
        this.world.eventManager.dispatch('gravityChange', { entity: this.owner, positionComponent: this })
    }
}
