import * as PIXI from "pixi.js"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class PixiComponent extends Component {

    color: any
    sprite: PIXI.Sprite
    type: string = 'pixi'

    constructor(entity: Entity, world: World, options: { color: string | 0xffffff, size: { height: number, width: number } }) {
        super(entity, world)
        const { color, size } = options
        this.color = color
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = this.color
        this.setSize(size)
    }

    addToStage() {
        this.world.engine.app.stage.addChild(this.sprite)
    }

    setPosition(position: { x: number, y: number }): void {
        this.sprite.x = position.x
        this.sprite.y = position.y
    }

    setSize(size: { height: number, width: number }): void {
        this.sprite.height = size.height
        this.sprite.width = size.width
    }

    removeFromStage() {
        this.world.engine.app.stage.removeChild(this.sprite)
    }
    
}