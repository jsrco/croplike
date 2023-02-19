import { Component } from "./component"
import * as PIXI from "pixi.js"

export class Speed implements Component {
    public readonly name = "speed"
    public velocity: PIXI.Point

    constructor() {
        this.velocity = new PIXI.Point(0, 0)
    }

    public update(delta: number): void {
        // No-op
    }
}