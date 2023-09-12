import RAPIER from "@dimforge/rapier2d"
import { CreateEntity, EntityMap } from "../entities/create-entity"
import { wall } from "../entities/templates-entity"
import { MovementSystem } from "../systems/movement"
import { PhysicsSystem } from "../systems/physics"
import { RenderSystem } from "../systems/render"
import { Room } from "../util/room"
import { Engine } from "../engine"

export type RoomMap = {
    entities: Array<EntityMap>
    roomDimensions: RAPIER.Vector2
    systemMap: SystemMap
    options?: any
}

export type SystemMap = {
    movement?: boolean,
    physics?: boolean,
    render?: boolean, 
}

const createBounds = (room: Room, roomMap: RoomMap): void => {
    const { roomDimensions } = roomMap
    // floor
    setBounds(wall, roomDimensions.x / 2, roomDimensions.y - (room.wallSize / 2), roomDimensions.x, room.wallSize)
    room.addEntity(CreateEntity(wall, room))
    // leftWall
    setBounds(wall, room.wallSize / 2, (roomDimensions.y / 2), room.wallSize, roomDimensions.y - (room.wallSize * 2))
    room.addEntity(CreateEntity(wall, room))
    // rightWall
    setBounds(wall, roomDimensions.x - (room.wallSize / 2), (roomDimensions.y / 2), room.wallSize, roomDimensions.y - (room.wallSize * 2))
    room.addEntity(CreateEntity(wall, room))
    // ceiling
    setBounds(wall, roomDimensions.x / 2, room.wallSize / 2, roomDimensions.x, room.wallSize)
    room.addEntity(CreateEntity(wall, room))
}

const createEntities = (engine: Engine, room: Room, roomMap: RoomMap): void => {
    const { entities } = roomMap

    for (let index = 0; index < entities.length; index++ ) {
        if (entities[index].name === 'player')  {
            engine.player = CreateEntity(entities[index], room)
            room.addEntity(engine.player)
        }
        if (entities[index].name === 'bigDemo') room.addEntity(CreateEntity(entities[index], room))
        if (entities[index].name === 'demo') room.addEntity(CreateEntity(entities[index], room))
        if (entities[index].name === 'growthDemo') room.addEntity(CreateEntity(entities[index], room))
    }
    createBounds(room, roomMap)
}

export const CreateRoom = (engine: Engine, roomMap: RoomMap): Room => {
    const { roomDimensions } = roomMap
    const room = new Room(engine, { roomDimensions })
   
    createEntities(engine, room, roomMap)
    loadSystems(room, roomMap)

    return room
}

const loadSystems = (room: Room, roomMap: RoomMap): void => {
    if (roomMap.systemMap.movement) room.addSystem(new MovementSystem(room))
    if (roomMap.systemMap.physics) room.addSystem(new PhysicsSystem(room))
    if (roomMap.systemMap.render) room.addSystem(new RenderSystem(room))
}

const setBounds = (entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void => {
    const { position, size } = entity.options
    position.x = positionX
    position.y = positionY
    size.x = sizeX
    size.y = sizeY
}