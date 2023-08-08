import * as PIXI from "pixi.js"
import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class PixiComponent extends Component {

    color: string
    position: RAPIER.Vector = { x: 0, y: 0 }
    size: object = { height: 0, width: 0 }
    sprite: PIXI.Sprite
    type: string = 'pixi'

    constructor(entity: Entity, world: World, options: { color: string | '#ffffff',  position: { x: number, y: number }, size: { height: number, width: number } }) {
        super(entity, world)
        const { color, position, size } = options
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

        position.x += (this.sprite.width / 2) 
        position.y += (this.sprite.height / 2)  
        this.position = position
    }

    setSize(size: { height: number, width: number }): void {
        this.sprite.height = size.height
        this.sprite.width = size.width
        this.size = size
    }

    removeFromStage() {
        this.world.engine.app.stage.removeChild(this.sprite)
    }
    
}