import RAPIER, { Vector2 } from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { PositionComponent } from "../components/position"
import { RapierComponent } from "../components/rapier"
import { SizeComponent } from "../components/size"
import { Engine } from "../engine"
import { Entity } from "../entities/entity"
import { System } from "../systems/system"
import { gridSize } from "./config-options"
import { EventManager } from "./event-manager"
import { KeyboardController } from "./keyboard-controller"
import { MovementComponent } from "../components/movement"

export class World {

    engine: Engine
    entities: Entity[]
    eventManager: EventManager = new EventManager()
    keyboardController: KeyboardController = new KeyboardController(this.eventManager)
    physicsWorld: RAPIER.World = new RAPIER.World(new Vector2(0, 500))
    physicsWorldEventQueue: RAPIER.EventQueue = new RAPIER.EventQueue(true)
    worldDimensions: Vector2
    systems: System[]
    wallSize: number = gridSize.value * 2

    constructor(engine: Engine, options: { worldDimensions: Vector2 }) {
        const { worldDimensions } = options
        this.engine = engine
        this.entities = []
        this.worldDimensions = worldDimensions
        this.systems = []
    }

    addEntity(entity: Entity): void {
        if (this.engine.name === 'Hunts') this.entities.push(entity)
        else if (this.isOkToPlace(entity)) this.entities.push(entity)
    }

    addSystem(system: System): void {
        this.systems.push(system)
    }
    
    findPositionToSet(entity: Entity, increment: number = gridSize.value): Vector2 | undefined {
        const positionComponent = entity.getComponent('position') as PositionComponent
        for (let y = 0; y <= this.worldDimensions.y; y += increment) {
            for (let x = 0; x <= this.worldDimensions.x; x += increment) {
                const newPosition = new Vector2(x, y)
                if (positionComponent.canSetTargetPosition(newPosition)) {
                    return newPosition
                }
            }
        }
        return undefined
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

    isInBounds(entity: Entity): boolean {
        const positionComponent = entity.getComponent('position') as PositionComponent
        const sizeComponent = entity.getComponent('size') as SizeComponent
        const { x, y } = positionComponent.targetPosition
        const { size } = sizeComponent
        return x >= 0 && y >= 0 && x + size.x <= this.worldDimensions.x && y + size.y <= this.worldDimensions.y
    }

    isOkToPlace(entity: Entity) {
        return this.isInBounds(entity) && this.isPositionClearFor(entity)
    }

    isPositionClearFor(entityToCheck: Entity): boolean {
        const positionComponent = entityToCheck.getComponent('position') as PositionComponent
        const sizeComponent = entityToCheck.getComponent('size') as SizeComponent
        const { x, y } = positionComponent.targetPosition
        const { size } = sizeComponent
        const entities = this.getEntitiesByComponent('position', 'size')
        for (const entity of entities) {
            const otherPositionComponent = entity.getComponent('position') as PositionComponent
            const otherSizeComponent = entity.getComponent('size') as SizeComponent
            if (entityToCheck.id === entity.id) {
                continue // Skip self
            }
            const targetLeft = x
            const targetRight = x + size.x
            const targetTop = y
            const targetBottom = y + size.y
            const otherLeft = otherPositionComponent.targetPosition.x
            const otherRight = otherPositionComponent.targetPosition.x + otherSizeComponent.size.x
            const otherTop = otherPositionComponent.targetPosition.y
            const otherBottom = otherPositionComponent.targetPosition.y + otherSizeComponent.size.y
            const isCollision = otherLeft < targetRight && otherRight > targetLeft && otherTop < targetBottom && otherBottom > targetTop
            if (isCollision) {
                // Handle collision or return false, depending on the use case
                const movementComponent = entityToCheck.getComponent('movement') as MovementComponent
                if (movementComponent && movementComponent.canPush) {
                    const otherMovementComponent = entity.getComponent('movement') as MovementComponent
                    if (otherMovementComponent && otherMovementComponent.canBePushed) {
                        const diffX = x - positionComponent.position.x
                        const diffY = y - positionComponent.position.y
                        if (otherPositionComponent.canSetTargetPosition(new Vector2(otherPositionComponent.position.x + diffX, otherPositionComponent.position.y + diffY))) return true
                    }
                }
                return false
            }
        }
        return true
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
