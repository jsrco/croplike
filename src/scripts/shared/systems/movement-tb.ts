import { PixiComponent } from "../components/pixi"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystemTB extends System {

    type: string = 'movement-TB'

    constructor(world: World) {
        super(world)
    }

    isOkToMove(entity: Entity): boolean {
        // Extract the position and size of the given entity
        const pixiComponent = entity.getComponent('pixi') as PixiComponent
        // Loop through the array of entities
        for (const otherEntity of this.world.entities) {
            // Skip the current entity itself
            if (otherEntity === entity) {
                continue
            }
            const otherPixiComponent = otherEntity.getComponent('pixi') as PixiComponent
            // Check for overlap between the two entities
            if (
                pixiComponent.position.x > otherPixiComponent.position.x + otherPixiComponent.size.x && // left
                pixiComponent.position.x + pixiComponent.size.x < otherPixiComponent.position.x && // right
                pixiComponent.position.y + pixiComponent.size.y < otherPixiComponent.position.y && // bottom
                pixiComponent.position.y > otherPixiComponent.position.y + otherPixiComponent.size.y // top
            ) {
                // Collision detected
                console.log(`Entity ${entity.name} is overlaps Entity ${otherEntity.name}`)
                console.log(pixiComponent.position, otherPixiComponent.position)
                return false
            }
        }
        // TODO check if in bounds
        // No collision detected
        return true
    }

    moveDown(component: PixiComponent): void {
        if (this.isOkToMove(component.owner)) component.setPosition({ x: component.position.x, y: component.position.y + 20 })
    }

    moveLeft(component: PixiComponent): void {
        if (this.isOkToMove(component.owner)) component.setPosition({ x: component.position.x - 20, y: component.position.y })
    }

    moveRight(component: PixiComponent): void {
        if (this.isOkToMove(component.owner)) component.setPosition({ x: component.position.x + 20, y: component.position.y })
    }

    moveUp(component: PixiComponent): void {
        if (this.isOkToMove(component.owner)) component.setPosition({ x: component.position.x, y: component.position.y - 20 })
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
            this.engine.shifting.value = false
        }
    }

}
