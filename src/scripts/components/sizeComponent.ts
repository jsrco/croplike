
import { Component } from "."
import { World } from "../util/World"


export class SizeComponent extends Component {
    height: number
    width: number
    type: string = 'size'

    constructor(world: World, x: number, y?: number) {
        super(world)
        this.height = y || x
        this.width = x
    }
    setSize(x: number, y?: number) {
        this.height = y || x
        this.width = x
        this.world.eventManager.dispatch('sizeChange', { entity: this.owner, sizeComponent: this })
    }
}

