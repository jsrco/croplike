import { CreateEntity, EntityMap } from "../entities/createEntity"
import { Entity } from "../entities/entity"
import { Room } from "./room"

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

    createAllEntityData(room: Room): void {
        for (const entity in room.entities) {
            const data = this.createEntityData(room.entities[entity])
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

    loadEntity(entityMap: EntityMap, room: Room) {
        const entity = CreateEntity(entityMap, room)
        room.addEntity(entity)
        if (entity.name === 'player') room.engine.player = entity
    }
}
