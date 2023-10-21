import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystemTB extends System {

    
    increment: number = 2
    move: number = 20
    type: string = 'movement-TB'

    constructor(world: World) {
        super(world)
    }

    moveDown(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x, y: y + this.increment }
        component.setPosition(newPosition)
    }

    moveLeft(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x - this.increment, y: y }
        component.setPosition(newPosition)
    }

    moveRight(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x + this.increment, y: y }
        component.setPosition(newPosition)
    }

    moveUp(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x, y: y - this.increment }
        component.setPosition(newPosition)
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('pixi')
        let allAtTarget = true
        for (const entity of entities) {
            const pixiComponent = entity.getComponent('pixi') as PixiComponent
            const { position, positionTarget } = pixiComponent
            const isAtTarget = position.x === positionTarget.x && position.y === positionTarget.y
            if (entity.name === 'player' && isAtTarget) {
                if (this.keys.has('ArrowDown')) {
                    const newPosition = { x: position.x, y: position.y + this.move }
                    if (pixiComponent.canSetPositionTarget(newPosition)) allAtTarget = false
                }
                if (this.keys.has('ArrowLeft')) {
                    const newPosition = { x: position.x - this.move, y: position.y }
                    if (pixiComponent.canSetPositionTarget(newPosition)) allAtTarget = false
                }
                if (this.keys.has('ArrowRight')) {
                    const newPosition = { x: position.x + this.move, y: position.y }
                    if (pixiComponent.canSetPositionTarget(newPosition)) allAtTarget = false
                }
                if (this.keys.has('ArrowUp')) {
                    const newPosition = { x: position.x, y: position.y - this.move }
                    if (pixiComponent.canSetPositionTarget(newPosition)) allAtTarget = false
                }
            }
            if (!isAtTarget) {
                const needsToGoDown = position.y < positionTarget.y
                if (needsToGoDown) this.moveDown(pixiComponent)
                const needsToGoLeft = position.x > positionTarget.x
                if (needsToGoLeft) this.moveLeft(pixiComponent)
                const needsToGoRight = position.x < positionTarget.x
                if (needsToGoRight) this.moveRight(pixiComponent)
                const needsToGoUp = position.y > positionTarget.y
                if (needsToGoUp) this.moveUp(pixiComponent)
                allAtTarget = false
            }
        }
        if (allAtTarget) this.engine.shifting.value = false
        else this.engine.shifting.value = true
    }

}
