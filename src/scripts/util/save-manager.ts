import { EntityMap } from "../entities/create-entity"
import { Entity } from "../entities/entity"
import { SystemMap } from "./create-room"
import { Room } from "./room"

export class SaveManager {

    data: any

    constructor() {
        this.data = {
            entities: [],
            roomDimensions: {},
            systemMap: {}
        }
    }

    clearData(): void {
        this.data = {
            entities: [],
            roomDimensions: {},
            systemMap: {}
        }
    }

    createEntityMap(entity: Entity): EntityMap | undefined {
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

    createRoomData(room: Room): void {
        const { entities, roomDimensions } = room
        for (const entity in entities) {
            const data = this.createEntityMap(entities[entity])
            if (data) this.data.entities.push(data)
        }
        this.data.roomDimensions = roomDimensions
        this.data.systemMap = this.createSystemsMap(room)
    }

    createSystemsMap(room: Room): SystemMap {
        const systemMap = {
            movement: false,
            physics: false,
            render: false,
        }
        if (room.getSystemByType('movement')) systemMap.movement = true
        if (room.getSystemByType('physics')) systemMap.physics = true
        if (room.getSystemByType('render')) systemMap.render = true
        return systemMap
    }

    getData() {
        return this.data
    }
    
}
