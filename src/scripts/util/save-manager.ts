import { CreateEntity, EntityMap } from "../entities/create"
import { Entity } from "../entities/entity"
import { World } from "./world"

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
            const data = this.createEntityData(world.entities[entity])
            if (data) this.data.entities.push(data)
        }
    }

    createEntityData(entity: Entity): EntityMap | undefined {
        if (entity.name !== 'wall') {
            const entityMap: any = {
                id: entity.id,
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
