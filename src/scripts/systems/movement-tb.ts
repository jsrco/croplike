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
                        newPosition.x += this.move
                    } else if (randomX > 0.7) {
                        newPosition.x -= this.move
                    }
                    if (randomY < 0.3) {
                        newPosition.y += this.move
                    } else if (randomY > 0.7) {
                        newPosition.y -= this.move
                    }
                    pixiComponent.canSetPositionTarget(newPosition)
                }
            }
            if (entity.name === 'player' && isAtTarget) {
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
