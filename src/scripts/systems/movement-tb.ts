import { Vector2 } from "@dimforge/rapier2d"
import { PositionComponent } from "../components/position"
import { gridSize } from "../util/config-options"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystemTB extends System {

    hasPlayerGone: boolean = false
    increment: number = 2
    move: number = gridSize.value
    type: string = 'movement-TB'

    constructor(world: World) {
        super(world)
    }
    
    adjustPosition(currentPosition: Vector2, newPosition: Vector2): Vector2 {
        const diffX = newPosition.x - currentPosition.x
        const diffY = newPosition.y - currentPosition.y
        // Adjust the new position based on movement restrictions (20 or 40)
        const adjustedX = diffX > 0 ? currentPosition.x + Math.min(this.move, diffX) : currentPosition.x - Math.min(this.move, Math.abs(diffX))
        const adjustedY = diffY > 0 ? currentPosition.y + Math.min(this.move, diffY) : currentPosition.y - Math.min(this.move, Math.abs(diffY))
        return new Vector2(adjustedX, adjustedY)
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

    partialMove(component: PositionComponent, newPosition: Vector2): void {
        const { x, y } = component.position
    }

    startMove(component: PositionComponent, newPosition: Vector2): void {
        if (component.canSetTargetPosition(newPosition)) {
            console.log(component.owner.name)
            this.hasPlayerGone = true
        } else {
            console.log(component.owner.name, "can't move there")
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
                        newPosition.x += this.move
                    } else if (randomX > 0.7) {
                        newPosition.x -= this.move
                    }
                    if (randomY < 0.3) {
                        newPosition.y += this.move
                    } else if (randomY > 0.7) {
                        newPosition.y -= this.move
                    }
                    // Adjust the position only if canSetTargetPosition returns false
                    this.startMove(positionComponent, newPosition)
                    // todo check if an entity is in the path. 
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
