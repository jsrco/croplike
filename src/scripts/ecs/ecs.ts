import * as PIXI from "pixi.js"
import { Entity } from "./entities/entity"
import { System } from "./systems/system"
import { EntityManager } from "./systems/entity-manager"
import { EventSystem } from "./util/events-system"
import { KeyboardController } from "./util/keyboard-controller"

export class ECS {
    private readonly app: PIXI.Application
    private readonly entityManager: EntityManager
    private readonly eventSystem: EventSystem
    private readonly keyboardController: KeyboardController

    constructor(app: PIXI.Application) {
        this.app = app
        // Create the entity manager
        this.entityManager = new EntityManager()
        // Create the event system
        this.eventSystem = new EventSystem()
        // Create the keyboard controller
        this.keyboardController = new KeyboardController()

        // Add keyboard event listeners
        this.keyboardController.addEventListener("keydown", (event) => {
            this.eventSystem.dispatchEvent("keydown", event)
        })

        this.keyboardController.addEventListener("keyup", (event) => {
            this.eventSystem.dispatchEvent("keyup", event)
        })
    }
    public addEntity(entity: Entity): void {
        this.entityManager.addEntity(entity)
    }
    public addSystem(system: System): void {
        this.entityManager.addSystem(system)
    }
    public removeEntity(entity: Entity): void {
        this.entityManager.removeEntity(entity)
    }
    public removeSystem(system: System): void {
        this.entityManager.removeSystem(system)
    }
    public start(): void {
        this.app.ticker.add((delta) => {
            this.update(delta)
        })
    }
    private update(delta: number): void {
        // Update systems with keyboard events
        this.entityManager.updateWithEvents(delta, this.eventSystem)
    }
}
