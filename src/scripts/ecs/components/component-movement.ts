import * as PIXI from 'pixi.js'
import { Component } from './component'

export class MovementComponent extends Component {
    speed: number
    velocity: PIXI.Point
    constructor(speed: number) {
        super("movement")
        this.speed = speed
        this.velocity = new PIXI.Point(0, 0)
    }
    move(direction: PIXI.Point) {
        this.velocity.x = direction.x * this.speed
        this.velocity.y = direction.y * this.speed
    }
    stop() {
        this.velocity.set(0, 0)
    }
    update(delta: number) {
        this.owner.x += this.velocity.x * delta
        this.owner.y += this.velocity.y * delta
    }
}