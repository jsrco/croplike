import * as PIXI from "pixi.js"
import { Entity } from "./entities/entity"
import { System } from "./systems/system"
import { EntityManager } from "./systems/entity-manager"

export class ECS {
    private readonly app: PIXI.Application
    private readonly entityManager: EntityManager

    constructor(app: PIXI.Application) {
        this.app = app

        this.entityManager = new EntityManager()
    }

    public start(): void {
        this.app.ticker.add((delta) => {
            this.update(delta)
        })
    }

    public addEntity(entity: Entity): void {
        this.entityManager.addEntity(entity)
        this.app.stage.addChild(entity)
    }

    public removeEntity(entity: Entity): void {
        this.entityManager.removeEntity(entity)
        this.app.stage.removeChild(entity)
    }

    public addSystem(system: System): void {
        this.entityManager.addSystem(system)
    }

    public removeSystem(system: System): void {
        this.entityManager.removeSystem(system)
    }

    private update(delta: number): void {
        this.entityManager.update(delta)
    }
}