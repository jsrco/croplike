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
        this.canSetPositionTarget(position)
        this.setSize(size)

        if (moveLeft && moveRight) {
            this.moveLeft = moveLeft
            this.moveRight = moveRight
        }
    }

    addToStage() {
        this.world.engine.app.stage.addChild(this.sprite)
    }

    canSetPositionTarget(position: RAPIER.Vector): boolean {
        let clear = false
        if (this.isOkToMove(position)) {
            this.positionTarget = position
            clear = true
        }
        return clear
    }

    findPositionToSet(initialPosition: RAPIER.Vector2, increment: number = 20): RAPIER.Vector2 | undefined {
        let currentX = initialPosition.x
        let currentY = initialPosition.y

        while (!this.canSetPositionTarget(new RAPIER.Vector2(currentX, currentY))) {
            currentX += increment
            if (currentX > this.world.worldDimensions.x) {
                currentX = initialPosition.x
                currentY += increment
                if (currentY > this.world.worldDimensions.y) {
                    return undefined // No unoccupied position found
                }
            }
        }
        return new RAPIER.Vector2(currentX, currentY)
    }

    isInBounds(size: RAPIER.Vector2, target: RAPIER.Vector2): boolean {
        const { x, y } = target
        const { worldDimensions } = this.world
        return x >= 0 && y >= 0 && x + size.x <= worldDimensions.x && y + size.y <= worldDimensions.y
    }

    isOkToMove(target: RAPIER.Vector2) {
        if (this.world.engine.name === 'Croplike') return true
        else return this.isInBounds(this.size, target) && this.isPositonClearFor(target)
    }

    isPositonClearFor(target: RAPIER.Vector2): boolean {
        const entities = this.world.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const otherPixiComponent = entity.getComponent('pixi') as PixiComponent
            // Skip the current entity itself
            if (this.owner.id === entity.id) {
                continue
            }
            const left1 = target.x
            const right1 = target.x + this.size.x
            const top1 = target.y
            const bottom1 = target.y + this.size.y

            const left2 = otherPixiComponent.positionTarget.x
            const right2 = otherPixiComponent.positionTarget.x + otherPixiComponent.size.x
            const top2 = otherPixiComponent.positionTarget.y
            const bottom2 = otherPixiComponent.positionTarget.y + otherPixiComponent.size.y

            const isOk = left2 >= right1 || right2 <= left1 || top2 >= bottom1 || bottom2 <= top1

            if (!isOk) return false
        }
        return true
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

    setSize(size: RAPIER.Vector): void {
        this.sprite.width = size.x
        this.sprite.height = size.y
        this.size = size
    }

}