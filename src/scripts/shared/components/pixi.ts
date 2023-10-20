import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Entity } from "../entities/entity"
import { PhysicsSystem } from "../systems/physics"
import { World } from "../util/world"
import { Component } from "./component"

export class PixiComponent extends Component {

    color: string
    maxSize: number
    position: RAPIER.Vector = { x: 0, y: 0 }
    positionTarget: RAPIER.Vector = { x: 0, y: 0 }
    size: RAPIER.Vector = { x: 0, y: 0 }
    sprite: PIXI.Sprite
    type: string = 'pixi'

    moveLeft: boolean = false
    moveRight: boolean = false

    constructor(entity: Entity, world: World, options: { color: string | '#ffffff', maxSize?: number, moveLeft?: boolean, moveRight?: boolean, position: RAPIER.Vector, size: RAPIER.Vector }) {
        super(entity, world)
        const { color, maxSize, moveLeft, moveRight, position, size } = options
        this.color = color
        this.maxSize = maxSize || 200
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = this.color

        this.setPosition(position)
        this.setPositionTarget(position)
        this.setSize(size)

        if (moveLeft && moveRight) {
            this.moveLeft = moveLeft
            this.moveRight = moveRight
        }
    }

    addToStage() {
        this.world.engine.app.stage.addChild(this.sprite)
    }

    removeFromStage() {
        this.world.engine.app.stage.removeChild(this.sprite)
    }

    setPosition(position: RAPIER.Vector): void {
        this.sprite.x = position.x
        this.sprite.y = position.y

        // Adjust for on save / load, Rapier RigidBody starting from the center of the collider
        const physicsSystem = this.world.getSystemByType('physics') as PhysicsSystem
        if (physicsSystem) {
            position.x += (this.sprite.width / 2)
            position.y += (this.sprite.height / 2)
        }
        this.position = position
    }

    setPositionTarget(position: RAPIER.Vector): void {
        this.positionTarget = position
    }

    setSize(size: RAPIER.Vector): void {
        this.sprite.width = size.x
        this.sprite.height = size.y
        this.size = size
    }

}