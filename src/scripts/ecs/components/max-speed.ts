import * as PIXI from 'pixi.js'
import { Component } from "./component"

export class MaxSpeed implements Component {
    public readonly name = "maxSpeed"
    public readonly value: number

    constructor(value: number = 0) {
        this.value = value
    }

    public update(delta: number): void {
        // No-op
    }
}