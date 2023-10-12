import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Entity } from "../entities/entity"
import { Room } from "../util/room"
import { Component } from "./component"

export class PixiComponent extends Component {

    color: string
    maxSize: number
    position: RAPIER.Vector = { x: 0, y: 0 }
    size: RAPIER.Vector = { x: 0, y: 0 }
    sprite: PIXI.Sprite
    type: string = 'pixi'

    moveLeft: boolean = false
    moveRight: boolean = false

    constructor(entity: Entity, room: Room, options: { color: string | '#ffffff', maxSize?: number, moveLeft?: boolean, moveRight?: boolean, size: RAPIER.Vector }) {
        super(entity, room)
        const { color, maxSize, moveLeft, moveRight, size } = options
        this.color = color
        this.maxSize = maxSize || 200
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = this.color
        this.setSize(size)

        if (moveLeft && moveRight) {
            this.moveLeft = moveLeft
            this.moveRight = moveRight
        }
    }

    addToStage() {
        this.room.engine.app.stage.addChild(this.sprite)
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
        this.room.engine.app.stage.removeChild(this.sprite)
    }
    
}