import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
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

    adjustPosition(currentPosition: RAPIER.Vector2, newPosition: RAPIER.Vector2): RAPIER.Vector2 {
        const diffX = newPosition.x - currentPosition.x
        const diffY = newPosition.y - currentPosition.y

        // Adjust the new position based on movement restrictions (20 or 40)
        const adjustedX = diffX > 0 ? currentPosition.x + Math.min(this.move, diffX) : currentPosition.x - Math.min(this.move, Math.abs(diffX))
        const adjustedY = diffY > 0 ? currentPosition.y + Math.min(this.move, diffY) : currentPosition.y - Math.min(this.move, Math.abs(diffY))

        return new RAPIER.Vector2(adjustedX, adjustedY)
    }

    allAtTarget(): boolean {
        const entities = this.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const pixiComponent = entity.getComponent('pixi') as PixiComponent
            const { position, positionTarget } = pixiComponent
            const isAtTarget = position.x === positionTarget.x && position.y === positionTarget.y
            if (!isAtTarget) return false
        }
        return true
    }

    moveDown(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = new RAPIER.Vector2(x, y + this.increment)
        component.setPosition(newPosition)
    }

    moveLeft(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = new RAPIER.Vector2(x - this.increment, y)
        component.setPosition(newPosition)
    }

    moveRight(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = new RAPIER.Vector2(x + this.increment, y)
        component.setPosition(newPosition)
    }

    moveUp(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = new RAPIER.Vector2(x, y - this.increment)
        component.setPosition(newPosition)
    }

    partialMove(component: PixiComponent, newPosition: RAPIER.Vector2): void {
        const { x, y } = component.position
    }

    startMove(component: PixiComponent, newPosition: RAPIER.Vector2): void {
        if (component.canSetPositionTarget(newPosition)) {
            this.hasPlayerGone = true
        }
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const pixiComponent = entity.getComponent('pixi') as PixiComponent
            const { position, positionTarget } = pixiComponent
            const isAtTarget = position.x === positionTarget.x && position.y === positionTarget.y
            if (entity.name === 'dummy' && isAtTarget && this.hasPlayerGone) {
                const player = this.world.getEntityByName('player')?.getComponent('pixi') as PixiComponent
                if (player.position.x === player.positionTarget.x && player.position.y === player.positionTarget.y) {
                    const newPosition = new RAPIER.Vector2(position.x, position.y)
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
                    // Adjust the position only if canSetPositionTarget returns false
                    if (!pixiComponent.canSetPositionTarget(newPosition)) {
                        // Adjust the new position based on the current position and movement restrictions
                        const adjustedPosition = this.adjustPosition(position, newPosition)

                        // Try to set the adjusted position
                        pixiComponent.canSetPositionTarget(adjustedPosition)
                    }
                }
            }
            if (entity.name === 'player' && this.allAtTarget()) {
                this.hasPlayerGone = false
                const arrowKeys = ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp']

                arrowKeys.forEach((key, index) => {
                    const keyActions = [
                        () => new RAPIER.Vector2(position.x, position.y + this.move),
                        () => new RAPIER.Vector2(position.x - this.move, position.y),
                        () => new RAPIER.Vector2(position.x + this.move, position.y),
                        () => new RAPIER.Vector2(position.x, position.y - this.move),
                        () => new RAPIER.Vector2(position.x - this.move, position.y + this.move),
                        () => new RAPIER.Vector2(position.x - this.move, position.y - this.move),
                        () => new RAPIER.Vector2(position.x + this.move, position.y + this.move),
                        () => new RAPIER.Vector2(position.x + this.move, position.y - this.move)
                    ]
                    if (this.keys.has(key)) {
                        this.startMove(pixiComponent, keyActions[index]())
                    }
                })
            }
            if (!isAtTarget) {
                const needsToGoDown = position.y < positionTarget.y
                const needsToGoLeft = position.x > positionTarget.x
                const needsToGoRight = position.x < positionTarget.x
                const needsToGoUp = position.y > positionTarget.y
                if (needsToGoDown) this.moveDown(pixiComponent)
                if (needsToGoLeft) this.moveLeft(pixiComponent)
                if (needsToGoRight) this.moveRight(pixiComponent)
                if (needsToGoUp) this.moveUp(pixiComponent)
            }
        }
    }

}
