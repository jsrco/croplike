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

    moveDown(component: PixiComponent): void {
        const { position, size } = component
        const { x, y } = position
        const newPosition: RAPIER.Vector2 = { x: x, y: y + this.move }
        if (this.isInBounds(size, newPosition)) component.setPosition(newPosition)
    }

    moveLeft(component: PixiComponent): void {
        const { position, size } = component
        const { x, y } = position
        const newPosition: RAPIER.Vector2 = { x: x - this.move, y: y }
        if (this.isInBounds(size, newPosition)) component.setPosition(newPosition)
    }

    moveRight(component: PixiComponent): void {
        const { position, size } = component
        const { x, y } = position
        const newPosition: RAPIER.Vector2 = { x: x + this.move, y: y }
        if (this.isInBounds(size, newPosition)) component.setPosition(newPosition)
    }

    moveUp(component: PixiComponent): void {
        const { position, size } = component
        const { x, y } = position
        const newPosition: RAPIER.Vector2 = { x: x, y: y - this.move }
        if (this.isInBounds(size, newPosition)) component.setPosition(newPosition)
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const pixiComponent = entity.getComponent('pixi') as PixiComponent

            if (entity.name === 'player') {
                if (this.keys.has('ArrowDown')) this.moveDown(pixiComponent)
                if (this.keys.has('ArrowLeft')) this.moveLeft(pixiComponent)
                if (this.keys.has('ArrowRight')) this.moveRight(pixiComponent)
                if (this.keys.has('ArrowUp')) this.moveUp(pixiComponent)
            }
        }
        this.engine.shifting.value = false
    }

}
