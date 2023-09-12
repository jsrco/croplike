import { EntityMap } from "../entities/create-entity"
import { Entity } from "../entities/entity"
import { RoomMap, SystemMap } from "./create-room"
import { Room } from "./room"

export class SaveManager {

    data: {
        room: number
        rooms: Array<RoomMap>
    }
    constructor() {
        this.data = {
            room: 0,
            rooms: []
        }
    }

    clearData(): void {
        this.data = {
            room: 0,
            rooms: []
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

    createRoomMap(room: Room): RoomMap {
        let roomData: RoomMap = {
            entities: [],
            roomDimensions: { x:0, y:0 },
            systemMap: {
                movement: false,
                physics: false,
                render: false
            }
        }
        const { entities, roomDimensions } = room
        for (const entity in entities) {
            const data = this.createEntityMap(entities[entity])
            if (data) roomData.entities.push(data)
        }
        roomData.roomDimensions = roomDimensions
        roomData.systemMap = this.createSystemsMap(room)
        return roomData
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

    setData(room: number, rooms: Array<RoomMap>):void {
        this.data.room = room
        this.data.rooms = rooms
    }
    
}
