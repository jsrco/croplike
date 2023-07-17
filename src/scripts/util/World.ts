import RAPIER from "@dimforge/rapier2d"
import { Entity } from "../entities/Entity"
import { System } from "../systems/System"
import { EventManager } from "../backup-pixi/util/EventManager"
import { KeyboardController } from "../backup-pixi/util/KeyboardController"
import { Engine } from "../Engine"

export class World {

    engine: Engine
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    physicsWorld: RAPIER.World
    systems: System[]

    constructor(engine: Engine) {
        this.engine = engine
        this.entities = []
        this.physicsWorld = new RAPIER.World({ x: 0.0, y: -50.0 })
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