import * as PIXI from 'pixi.js'
import { Component } from "./component"

export class Position implements Component {
    public readonly name = "position"
    public readonly value: PIXI.Point

    constructor(x: number = 0, y: number = 0) {
        this.value = new PIXI.Point(x, y)
    }

    public update(delta: number): void {
        // No-op
    }
}