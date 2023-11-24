import { Vector2 } from "@dimforge/rapier2d"
import { PositionComponent } from "../components/position"
import { gridSize } from "../util/config-options"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystemTB extends System {

    hasPlayerGone: boolean = false
    increment: number = 2 // needs to be divisible by move
    move: number = gridSize.value
    type: string = 'movement-TB'

    constructor(world: World) {
        super(world)
    }

    allAtTarget(): boolean {
        const entities = this.getEntitiesByComponent('position')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            const { position, targetPosition } = positionComponent
            const isAtTarget = position.x === targetPosition.x && position.y === targetPosition.y
            if (!isAtTarget) return false
        }
        return true
    }

    isPathClearFor(entityToCheck: Entity, newPosition: Vector2): boolean {
        // const positionComponent = entityToCheck.getComponent('position') as PositionComponent
        // const sizeComponent = entityToCheck.getComponent('size') as SizeComponent
        // const { x, y } = positionComponent.targetPosition
        // const { size } = sizeComponent
        // const entities = this.getEntitiesByComponent('position', 'size')
        // for (const entity of entities) {
        //     const otherPositionComponent = entity.getComponent('position') as PositionComponent
        //     const otherSizeComponent = entity.getComponent('size') as SizeComponent
        //     if (entityToCheck.id === entity.id) {
        //         continue // Skip self
        //     }
        //     const targetLeft = x
        //     const targetRight = x + size.x
        //     const targetTop = y
        //     const targetBottom = y + size.y
        //     const otherLeft = otherPositionComponent.targetPosition.x
        //     const otherRight = otherPositionComponent.targetPosition.x + otherSizeComponent.size.x
        //     const otherTop = otherPositionComponent.targetPosition.y
        //     const otherBottom = otherPositionComponent.targetPosition.y + otherSizeComponent.size.y
        //     const isCollision = otherLeft < targetRight && otherRight > targetLeft && otherTop < targetBottom && otherBottom > targetTop
        //     if (isCollision) {
        //         // Handle collision or return false, depending on the use case
        //         return false
        //     }
        // }
        // return true
    }

    moveDown(component: PositionComponent): void {
        const { x, y } = component.position
        const newPosition: Vector2 = new Vector2(x, y + this.increment)
        component.setPosition(newPosition)
    }

    moveLeft(component: PositionComponent): void {
        const { x, y } = component.position
        const newPosition: Vector2 = new Vector2(x - this.increment, y)
        component.setPosition(newPosition)
    }

    moveRight(component: PositionComponent): void {
        const { x, y } = component.position
        const newPosition: Vector2 = new Vector2(x + this.increment, y)
        component.setPosition(newPosition)
    }

    moveUp(component: PositionComponent): void {
        const { x, y } = component.position
        const newPosition: Vector2 = new Vector2(x, y - this.increment)
        component.setPosition(newPosition)
    }

    startMove(component: PositionComponent, newPosition: Vector2): void {
        const { x, y } = component.position
        if (x === newPosition.x && y === newPosition.y) {
            console.log(component.owner.name, 'already there')
        } else {
            // todo: check if path is clear using: this.isPathClearFor(component.owner, newPosition)
            if (component.canSetTargetPosition(newPosition)) {
                if (component.owner.name === 'player') this.hasPlayerGone = true
            } else {
                const diffX = newPosition.x - x
                const diffY = newPosition.y - y
                if (Math.abs(diffX) <= 20 && Math.abs(diffY) <= 20) {
                } else if (Math.abs(diffX) > 20 || Math.abs(diffY) > 20) {
                    const adjustedX = diffX === 0 ? x : diffX > 0 ? x + (diffX - this.move) : x + (diffX + this.move)
                    const adjustedY = diffY === 0 ? y : diffY > 0 ? y + (diffY - this.move) : y + (diffY + this.move)
                    this.startMove(component, new Vector2(adjustedX, adjustedY))
                }
            }
        }
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('position')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            const { position, targetPosition } = positionComponent
            const allAtTarget = this.allAtTarget()
            const isAtTarget = position.x === targetPosition.x && position.y === targetPosition.y
            if (entity.name === 'dummy' && allAtTarget && this.hasPlayerGone) {
                const player = this.world.getEntityByName('player')?.getComponent('position') as PositionComponent
                if (player.position.x === player.targetPosition.x && player.position.y === player.targetPosition.y) {
                    const newPosition = new Vector2(position.x, position.y)
                    const randomX = Math.random()
                    const randomY = Math.random()
                    if (randomX < 0.3) {
                        newPosition.x += this.move * 3
                    } else if (randomX > 0.7) {
                        newPosition.x -= this.move * 3
                    }
                    if (randomY < 0.3) {
                        newPosition.y += this.move * 3
                    } else if (randomY > 0.7) {
                        newPosition.y -= this.move * 3
                    }
                    this.startMove(positionComponent, newPosition)
                }
            }
            if (entity.name === 'player' && allAtTarget) {
                this.hasPlayerGone = false
                const arrowKeys = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp']
                arrowKeys.forEach((key, index) => {
                    const keyActions = [
                        () => new Vector2(position.x, position.y + this.move),
                        () => new Vector2(position.x - this.move, position.y),
                        () => new Vector2(position.x + this.move, position.y),
                        () => new Vector2(position.x, position.y - this.move),
                        () => new Vector2(position.x - this.move, position.y + this.move),
                        () => new Vector2(position.x - this.move, position.y - this.move),
                        () => new Vector2(position.x + this.move, position.y + this.move),
                        () => new Vector2(position.x + this.move, position.y - this.move)
                    ]
                    if (this.keys.has(key)) {
                        this.startMove(positionComponent, keyActions[index]())
                    }
                })
            }
            if (!isAtTarget) {
                const needsToGoDown = position.y < targetPosition.y
                const needsToGoLeft = position.x > targetPosition.x
                const needsToGoRight = position.x < targetPosition.x
                const needsToGoUp = position.y > targetPosition.y
                if (needsToGoDown) this.moveDown(positionComponent)
                if (needsToGoLeft) this.moveLeft(positionComponent)
                if (needsToGoRight) this.moveRight(positionComponent)
                if (needsToGoUp) this.moveUp(positionComponent)
            }
        }
    }

}
