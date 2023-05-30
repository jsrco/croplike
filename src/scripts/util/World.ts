import * as PIXI from "pixi.js"
import { Entity } from "../entities/Entity"
import { System } from "../systems/index"
import { EventManager } from "./EventManager"
import { KeyboardController } from "./KeyboardController"

export class World {
    app: PIXI.Application
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    systems: System[]

    constructor(app: PIXI.Application) {
        this.app = app

        this.entities = []
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