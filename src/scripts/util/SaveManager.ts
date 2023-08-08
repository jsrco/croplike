import { CreateEntity, EntityMap } from "../entities/Create"
import { Entity } from "../entities/Entity"
import { World } from "./World"

export class SaveManager {

    data: any

    constructor() {
        this.data = {
            entities: []
        }
    }

    clearData(): void {
        this.data = {
            entities: []
        }
    }

    createAllEntityData(world: World): void {
        for (const entity in world.entities) {
            this.data.entities.push(this.createEntityData(world.entities[entity]))
        }
    }

    createEntityData(entity: Entity): EntityMap {
        const entityMap: any = {
            name: entity.name,
            componentMap: {},
            options: {},
        }
        for (const compontent in entity.components) {
            const targetComponent = entity.components[compontent]
            entityMap.componentMap[targetComponent.type] = true
            entityMap.options = {
                ...entityMap.options,
                ...targetComponent.copyComponentData(targetComponent)
            }
        }
        return entityMap
    }

    getData() {
        return this.data
    }

    loadEntity(entityMap: EntityMap, world: World) {
        const entity = CreateEntity(entityMap, world)
        world.addEntity(entity)
        if (entity.name === 'player') world.engine.player = entity
    }
}
