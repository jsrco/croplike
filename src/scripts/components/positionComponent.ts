import { Component } from "./Component"
import { World } from "../util/World"

export class PositionComponent extends Component {
    type: string = 'position'
    x: number = 0
    y: number = 0
    
    constructor(world: World) {
        super(world)

        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }
    private onKeyChange(data: any): void {
        if (data.isDown) {
            if (data.key === 'ArrowLeft') {
                this.setPosition(this.x - 1, this.y)
            } else if (data.key === 'ArrowRight') {
                this.setPosition(this.x + 1, this.y)
            }
        }
    }
    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }
}