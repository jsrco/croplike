import * as PIXI from 'pixi.js'
import { Component } from "./component"

export class Drag implements Component {
    public readonly name = "drag"
    public readonly value: number

    constructor(value: number = 0) {
        this.value = value
    }

    public update(delta: number): void {
        // No-op
    }
}