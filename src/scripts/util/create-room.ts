import { Engine } from "../engine"
import { CreateEntity, EntityMap } from "../entities/create-entity"
import { bigDemoEntity, demoEntity, growthDemoEntity, player, wall } from "../entities/templates-entity"
import { MovementSystem } from "../systems/movement"
import { PhysicsSystem } from "../systems/physics"
import { RenderSystem } from "../systems/render"
import { Room } from "../util/room"

const wallThickness: number = 40

export type RoomMap = {
    entities: Array<EntityMap>
    systemMap: SystemMap
    options?: any
}

export type SystemMap = {
    movement?: boolean,
    physics?: boolean,
    render?: boolean, 
}

export const createRoom = (engine: Engine, roomMap: RoomMap): Room => {
    const room = new Room(engine)
   
    createEntities(engine, room, roomMap)
    loadSystems(room, roomMap)

    return room
}

const createBounds = (engine: Engine, room: Room): void => {
    // floor
    setBounds(wall, engine.appDimensions.x / 2, engine.appDimensions.y - (wallThickness / 2), engine.appDimensions.x, wallThickness)
    room.addEntity(CreateEntity(wall, room))
    // leftWall
    setBounds(wall, wallThickness / 2, (engine.appDimensions.y / 2), wallThickness, engine.appDimensions.y - (wallThickness * 2))
    room.addEntity(CreateEntity(wall, room))
    // rightWall
    setBounds(wall, engine.appDimensions.x - (wallThickness / 2), (engine.appDimensions.y / 2), wallThickness, engine.appDimensions.y - (wallThickness * 2))
    room.addEntity(CreateEntity(wall, room))
    // ceiling
    setBounds(wall, engine.appDimensions.x / 2, wallThickness / 2, engine.appDimensions.x, wallThickness)
    room.addEntity(CreateEntity(wall, room))
}

const createEntities = (engine: Engine, room: Room, roomMap: RoomMap): void => {
    for (let index = 0; index < roomMap.entities.length; index++ ) {
        if (roomMap.entities[index].name === 'player')  {
            engine.player = CreateEntity(roomMap.entities[index], room)
            room.addEntity(engine.player)
        }
        if (roomMap.entities[index].name === 'bigDemo') room.addEntity(CreateEntity(roomMap.entities[index], room))
        if (roomMap.entities[index].name === 'demo') room.addEntity(CreateEntity(roomMap.entities[index], room))
        if (roomMap.entities[index].name === 'growthDemo') room.addEntity(CreateEntity(roomMap.entities[index], room))
    }
    createBounds(engine, room)
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