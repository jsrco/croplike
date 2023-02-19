import * as PIXI from 'pixi.js'

export interface Component {
    readonly name: string
    update(delta: number): void
}

class PositionComponent implements Component {
    public name = "position"

    constructor(public x: number, public y: number) { }
    public update(delta: number): void {
        // Do nothing
    }
}
export class VelocityComponent implements Component {
    public name = "velocity"

    constructor(public x: number, public y: number) { }
    public update(delta: number): void {
        // Do nothing
    }
}
