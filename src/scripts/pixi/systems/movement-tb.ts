import { Vector2 } from "@dimforge/rapier2d"
import { MovementComponent } from "../components/movement"
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

    getMoveTo(target: Vector2, current: Vector2, allowedMoves: number): Vector2 {
        const diffX = target.x - current.x
        const diffY = target.y - current.y
        if (diffX === 0 && diffY === 0) {
            return current
        }
        const maxMoveX = Math.sign(diffX) * this.move
        const maxMoveY = Math.sign(diffY) * this.move
        // Calculate the actual move distance based on increments of this.move
        let moveX = 0
        let moveY = 0

        let allowed = 0
        while (allowed < allowedMoves && Math.abs(moveX) < Math.abs(diffX) && Math.abs(moveX + this.move) <= Math.abs(maxMoveX)) {
            allowed++
            moveX += Math.sign(diffX) * this.move
        }
        allowed = 0
        while (allowed < allowedMoves && Math.abs(moveY) < Math.abs(diffY) && Math.abs(moveY + this.move) <= Math.abs(maxMoveY)) {
            allowed++
            moveY += Math.sign(diffY) * this.move
        }
        // todo correct over move
        // console.log(current)
        return new Vector2(current.x + moveX, current.y + moveY)
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
            const diffX = newPosition.x - x
            const diffY = newPosition.y - y
            if (Math.abs(diffX) <= this.move && Math.abs(diffY) <= this.move) {
                if (component.canSetTargetPosition(newPosition)) {
                    if (component.owner.name === 'player') this.hasPlayerGone = true
                } else console.log(component.owner.name, "can't move there")
            } else if (Math.abs(diffX) > this.move || Math.abs(diffY) > this.move) {
                let clearedPosition: Vector2 = { x, y }
                while (clearedPosition.x !== newPosition.x || clearedPosition.y !== newPosition.y) {
                    const adjustedX = diffX === 0 ? clearedPosition.x : diffX > 0 ? clearedPosition.x + this.move : clearedPosition.x - this.move
                    const adjustedY = diffY === 0 ? clearedPosition.y : diffY > 0 ? clearedPosition.y + this.move : clearedPosition.y - this.move
                    const adjustedVector = new Vector2(adjustedX, adjustedY)
                    if (component.canSetTargetPosition(adjustedVector)) {
                        if (component.owner.name === 'player') this.hasPlayerGone = true
                        clearedPosition = adjustedVector
                    } else {
                        this.startMove(component, clearedPosition)
                        break
                    }
                }
            }
        }
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('movement', 'position')
        for (const entity of entities) {
            const movementComponent = entity.getComponent('movement') as MovementComponent
            const positionComponent = entity.getComponent('position') as PositionComponent
            const { allowedMoves } = movementComponent
            const { position, targetPosition } = positionComponent
            const allAtTarget = this.allAtTarget()
            const isAtTarget = position.x === targetPosition.x && position.y === targetPosition.y
            if ((entity.name === 'dummy' || entity.name === 'stalker') && allAtTarget && this.hasPlayerGone) {
                const player = this.world.getEntityByName('player')?.getComponent('position') as PositionComponent
                if (player.position.x === player.targetPosition.x && player.position.y === player.targetPosition.y) {
                    const newPosition = this.getMoveTo(player.position, position, allowedMoves)
                    if (entity.name === 'dummy') {
                        newPosition.x = position.x
                        newPosition.y = position.y
                        const randomX = Math.random()
                        const randomY = Math.random()
                        if (randomX < 0.3) {
                            newPosition.x += this.move * allowedMoves
                        } else if (randomX > 0.7) {
                            newPosition.x -= this.move * allowedMoves
                        }
                        if (randomY < 0.3) {
                            newPosition.y += this.move * allowedMoves
                        } else if (randomY > 0.7) {
                            newPosition.y -= this.move * allowedMoves
                        }
                        this.startMove(positionComponent, newPosition)
                    }
                    if (entity.name === 'stalker') this.startMove(positionComponent, newPosition)
                }
            }
            if (entity.name === 'player' && allAtTarget) {
                this.hasPlayerGone = false
                const arrowKeys = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp']
                arrowKeys.forEach((key, index) => {
                    const keyActions = [
                        () => new Vector2(position.x, position.y + (this.move * allowedMoves)),
                        () => new Vector2(position.x - (this.move * allowedMoves), position.y),
                        () => new Vector2(position.x + (this.move * allowedMoves), position.y),
                        () => new Vector2(position.x, position.y - (this.move * allowedMoves)),
                        () => new Vector2(position.x - (this.move * allowedMoves), position.y + (this.move * allowedMoves)),
                        () => new Vector2(position.x - (this.move * allowedMoves), position.y - (this.move * allowedMoves)),
                        () => new Vector2(position.x + (this.move * allowedMoves), position.y + (this.move * allowedMoves)),
                        () => new Vector2(position.x + (this.move * allowedMoves), position.y - (this.move * allowedMoves))
                    ]
                    if (this.keys.has(key)) {
                        this.startMove(positionComponent, keyActions[index]())
                    }
                })
            }
            // todo find a way to run this on all entities at once.
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