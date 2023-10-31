import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Entity } from "../entities/entity"
import { PhysicsSystem } from "../systems/physics"
import { gridSize } from "../util/config-options"
import { World } from "../util/world"
import { Component } from "./component"

export class PixiComponent extends Component {

    color: string
    maxSize: number
    position: RAPIER.Vector = new RAPIER.Vector2(0, 0)
    positionTarget: RAPIER.Vector = new RAPIER.Vector2(0, 0)
    size: RAPIER.Vector = new RAPIER.Vector2(0, 0)
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
        this.setSize(size)

        this.canSetPositionTarget(position)

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

    findPositionToSet(increment: number = gridSize.value): RAPIER.Vector | undefined {
        for (let y = 0; y <= this.world.worldDimensions.y; y += increment) {
            for (let x = 0; x <= this.world.worldDimensions.x; x += increment) {
                const newPosition = new RAPIER.Vector2(x, y)
                if (this.isInBounds(this.size, newPosition) && this.isPositionClearFor(newPosition)) {
                    return newPosition
                }
            }
        }
        return undefined
    }

    isInBounds(size: RAPIER.Vector2, target: RAPIER.Vector2): boolean {
        const { x, y } = target
        const { worldDimensions } = this.world
        return x >= 0 && y >= 0 && x + size.x <= worldDimensions.x && y + size.y <= worldDimensions.y
    }

    isOkToMove(target: RAPIER.Vector2) {
        if (this.world.engine.name === 'Hunts') return true // this.isPositionClearFor(target)
        else return this.isInBounds(this.size, target) && this.isPositionClearFor(target)
    }

    isPositionClearFor(target: RAPIER.Vector2): boolean {
        const entities = this.world.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const otherPixiComponent = entity.getComponent('pixi') as PixiComponent
            if (this.owner.id === entity.id) {
                continue // Skip self
            }
            const targetLeft = target.x
            const targetRight = target.x + this.size.x
            const targetTop = target.y
            const targetBottom = target.y + this.size.y
            const otherLeft = otherPixiComponent.positionTarget.x
            const otherRight = otherPixiComponent.positionTarget.x + otherPixiComponent.size.x
            const otherTop = otherPixiComponent.positionTarget.y
            const otherBottom = otherPixiComponent.positionTarget.y + otherPixiComponent.size.y
            const isCollision = otherLeft < targetRight && otherRight > targetLeft && otherTop < targetBottom && otherBottom > targetTop
            if (isCollision) {
                // Handle collision or return false, depending on the use case
                return false
            }
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