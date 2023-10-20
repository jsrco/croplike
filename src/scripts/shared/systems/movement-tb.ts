import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystemTB extends System {

    move: number = 20
    type: string = 'movement-TB'

    constructor(world: World) {
        super(world)
    }

    isInBounds(size: RAPIER.Vector2, target: RAPIER.Vector2): boolean {
        const { x, y } = target
        const { worldDimensions } = this.world
        return x >= 0 && y >= 0 && x + size.x <= worldDimensions.x && y + size.y <= worldDimensions.y
    }

    isOkToMove(pixiComponent: PixiComponent, target: RAPIER.Vector2) {
        return this.isInBounds(pixiComponent.size, target) && this.isPositonClearFor(pixiComponent, target)
    }

    isPositonClearFor(pixiComponent: PixiComponent, target: RAPIER.Vector2): boolean {
        const entities = this.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const otherPixiComponent = entity.getComponent('pixi') as PixiComponent
            // Skip the current entity itself
            if (pixiComponent.owner.id === entity.id) {
                continue
            }
            const left1 = target.x
            const right1 = target.x + pixiComponent.size.x
            const top1 = target.y
            const bottom1 = target.y + pixiComponent.size.y

            const left2 = otherPixiComponent.positionTarget.x
            const right2 = otherPixiComponent.positionTarget.x + otherPixiComponent.size.x
            const top2 = otherPixiComponent.positionTarget.y
            const bottom2 = otherPixiComponent.positionTarget.y + otherPixiComponent.size.y

            return left2 >= right1 || right2 <= left1 || top2 >= bottom1 || bottom2 <= top1
        }
        return true
    }

    moveDown(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x, y: y + 4 }
        component.setPosition(newPosition)
    }

    moveLeft(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x - 4, y: y }
        component.setPosition(newPosition)
    }

    moveRight(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x + 4, y: y }
        component.setPosition(newPosition)
    }

    moveUp(component: PixiComponent): void {
        const { x, y } = component.position
        const newPosition: RAPIER.Vector2 = { x: x, y: y - 4 }
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
                    if (this.isOkToMove(pixiComponent, newPosition)) {
                        pixiComponent.setPositionTarget(newPosition)
                        allAtTarget = false
                    }
                }
                if (this.keys.has('ArrowLeft')) {
                    const newPosition = { x: position.x - this.move, y: position.y }
                    if (this.isOkToMove(pixiComponent, newPosition)) {
                        pixiComponent.setPositionTarget(newPosition)
                        allAtTarget = false
                    }
                }
                if (this.keys.has('ArrowRight')) {
                    const newPosition = { x: position.x + this.move, y: position.y }
                    if (this.isOkToMove(pixiComponent, newPosition)) {
                        pixiComponent.setPositionTarget(newPosition)
                        allAtTarget = false
                    }

                }
                if (this.keys.has('ArrowUp')) {
                    const newPosition = { x: position.x, y: position.y - this.move }
                    if (this.isOkToMove(pixiComponent, newPosition)) {
                        pixiComponent.setPositionTarget(newPosition)
                        allAtTarget = false
                    }
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
