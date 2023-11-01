import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { Engine } from "../engine"
import { Entity } from "../entities/entity"
import { System } from "../systems/system"
import { gridSize } from "./config-options"
import { EventManager } from "./event-manager"
import { KeyboardController } from "./keyboard-controller"

export class World {

    engine: Engine
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    physicsWorld: RAPIER.World = new RAPIER.World({ x: 0.0, y: 500.0 })
    physicsWorldEventQueue: RAPIER.EventQueue = new RAPIER.EventQueue(true)
    worldDimensions: RAPIER.Vector2
    systems: System[]
    wallSize: number = gridSize.value * 2

    constructor(engine: Engine, options: { worldDimensions: RAPIER.Vector }) {
        const { worldDimensions } = options

        this.engine = engine
        this.entities = []
        this.worldDimensions = worldDimensions
        this.systems = []
    }

    addEntity(entity: Entity): void {
        const pixiComponent = entity.getComponent('pixi') as PixiComponent
        if (pixiComponent.canSetPositionTarget(pixiComponent.position)) this.entities.push(entity)
        else {
            console.log('failed to add', entity.name, entity.id)
            const newPosition = pixiComponent.findPositionToSet()
            if (newPosition) {
                pixiComponent.setPosition(newPosition)
                this.addEntity(entity)
            }
            else console.log('cannot add', entity.name, entity.id)
        }
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

    getEntityByName(name: string): Entity | undefined {
        return this.entities.find(entity => entity.name === name)
    }

    getSystemByType(type: string) {
        return this.systems.find(system => system.type === type)
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
