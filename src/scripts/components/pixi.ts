import * as PIXI from "pixi.js"
import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/entity"
import { Component } from "./component"
import { World } from "../util/world"

export class PixiComponent extends Component {

    color: string
    maxSize: number
    position: RAPIER.Vector = { x: 0, y: 0 }
    size: RAPIER.Vector = { x: 0, y: 0 }
    sprite: PIXI.Sprite
    type: string = 'pixi'

    moveLeft: boolean = false
    moveRight: boolean = false

    constructor(entity: Entity, world: World, options: { color: string | '#ffffff', moveLeft?: boolean, moveRight?: boolean, size: RAPIER.Vector }) {
        super(entity, world)
        const { color, moveLeft, moveRight, size } = options
        this.color = color
        this.maxSize = size.y
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = this.color
        this.setSize(size)

        if (moveLeft && moveRight) {
            this.moveLeft = moveLeft
            this.moveRight = moveRight
        }
    }

    addToStage() {
        this.world.engine.app.stage.addChild(this.sprite)
    }

    setPosition(position: RAPIER.Vector): void {
        this.sprite.x = position.x
        this.sprite.y = position.y

        // Adjust for on save / load, Rapier RigidBody starting from the center of the collider
        position.x += (this.sprite.width / 2) 
        position.y += (this.sprite.height / 2)  
        this.position = position
    }

    setSize(size: RAPIER.Vector): void {
        this.sprite.width = size.x
        this.sprite.height = size.y
        this.size = size
    }

    removeFromStage() {
        this.world.engine.app.stage.removeChild(this.sprite)
    }
    
}