import { Component } from './Component'
import { World } from "../util/World"

export class WallComponent extends Component {
    isMobile: boolean = false
    isWall: boolean = true
    type: string = 'wall'
    
    constructor(world: World) {
        super(world)
    }
}
