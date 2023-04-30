import { Component } from "."
import { World } from "../util/World"

export class PositionComponent extends Component {
    previousPosition: { x: number, y: number }
    type: string = 'position'
    x: number = 0
    y: number = 0

    constructor(world: World, x: number, y: number) {
        super(world)
        this.previousPosition = { x: this.x, y: this.y }
        this.setPosition(x, y)
        this.world.eventManager.subscribe('save', this.save.bind(this))
    }
    save() {
        // Override this method in each subclass
        console.dir(`saving ${this.type} component for ${this.owner.name}`)
        console.dir(this.copyComponentData(this))
    }
    setPosition(x: number, y: number) {
        this.previousPosition = { x: this.x, y: this.y }
        this.x = x
        this.y = y
        this.world.eventManager.dispatch('positionChange', { entity: this.owner, positionComponent: this })
    }
}