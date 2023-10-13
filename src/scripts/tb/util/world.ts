import RAPIER from "@dimforge/rapier2d"
import { EventManager } from "../../shared/util/event-manager"
import { KeyboardController } from "../../shared/util/keyboard-controller"
import { Engine } from "../engine"
import { Entity } from "../entities/entity"
import { System } from "../systems/system"

export class World {

    engine: Engine
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    worldDimensions: RAPIER.Vector2
    systems: System[]

    constructor(engine: Engine, options: { worldDimensions: RAPIER.Vector }) {
        const { worldDimensions } = options

        this.engine = engine
        this.entities = []
        this.worldDimensions = worldDimensions
        this.systems = []
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity)
    }

    addSystem(system: System): void {
        this.systems.push(system)
    }

    getEntitiesByComponent(...componentTypes: string[]): Entity[] {
        return this.entities.filter(entity =>
            componentTypes.every(type => entity.hasComponent(type))
        )
    }

    getSystemByType(type: string) {
        return this.systems.find(system => system.type === type)
    }
    
    removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity)
        if (index !== -1) {
            this.entities.splice(index, 1)
        }
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
