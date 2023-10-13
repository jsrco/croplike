import RAPIER from "@dimforge/rapier2d"
import { EventManager } from "../../shared/util/event-manager"
import { KeyboardController } from "../../shared/util/keyboard-controller"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { Engine } from "../engine"
import { Entity } from "../entities/entity"
import { System } from "../systems/system"

export class Room {

    engine: Engine
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    physicsWorld: RAPIER.World = new RAPIER.World({ x: 0.0, y: 500.0 })
    physicsWorldEventQueue: RAPIER.EventQueue = new RAPIER.EventQueue(true)
    roomDimensions: RAPIER.Vector2
    systems: System[]
    wallSize: number = 40

    constructor(engine: Engine, options: { roomDimensions: RAPIER.Vector }) {
        const { roomDimensions } = options

        this.engine = engine
        this.entities = []
        this.roomDimensions = roomDimensions
        this.systems = []
    }

    addEntity(entity: Entity): void {
        if (!this.isTouching(entity, this.entities)) this.entities.push(entity)
        // else find new spot
        // also check that entity is in bounds
    }

    addSystem(system: System): void {
        this.systems.push(system)
    }

    getEntitiesByComponent(...componentTypes: string[]): Entity[] {
        return this.entities.filter(entity =>
            componentTypes.every(type => entity.hasComponent(type))
        )
    }

    getEntityByHandle(handle: number): Entity | undefined {
        return this.entities.find(entity => entity.handle === handle)
    }

    getSystemByType(type: string) {
        return this.systems.find(system => system.type === type)
    }

    isTouching(entity: Entity, entities: Array<Entity>): boolean {
        // Extract the position and size of the given entity
        const pixiComponent = entity.getComponent('pixi') as PixiComponent

        // Loop through the array of entities
        for (const otherEntity of entities) {
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
                return true
            }
        }
        // No collision detected
        return false
    }

    removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity)
        if (index !== -1) {
            this.entities.splice(index, 1)
        }
        const pixiComponent = entity.getComponent('pixi') as PixiComponent
        if (pixiComponent) pixiComponent.removeFromStage()
        const rapierComponent = entity.getComponent('rapier') as RapierComponent
        if (rapierComponent) rapierComponent.removeColliderGraphics()
    }

    removeSystem(system: System): void {
        const index = this.systems.indexOf(system)
        if (index !== -1) {
            this.systems.splice(index, 1)
        }
    }

    update(deltaTime: number): void {
        for (const system of this.systems) {
            system.update(deltaTime)
        }
    }

}
