import { Engine } from "../engine"
import { CreateEntity, EntityMap } from "../entities/create-entity"
import { bigDemoEntity, demoEntity, growthDemoEntity, player, wall } from "../entities/templates-entity"
import { MovementSystem } from "../systems/movement"
import { PhysicsSystem } from "../systems/physics"
import { RenderSystem } from "../systems/render"
import { Room } from "../util/room"

const wallThickness: number = 40

export type RoomMap = {
    entityCountMap: {
        bigDemoEntity?: number
        demoEntity?: number
        growthDemoEntity?: number
    }
    systemMap: {
        movement?: boolean,
        physics?: boolean,
        render?: boolean, 
    }
    options?: any
}

export const createRoom = (engine: Engine, roomMap: RoomMap): Room => {
    const room = new Room(engine)
    
    engine.player = CreateEntity(player, room)
    room.addEntity(engine.player)

    createEntities(engine, room, roomMap)
    loadSystems(room, roomMap)

    return room
}

function createBounds(engine: Engine, room: Room): void {
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

function createEntities(engine: Engine, room: Room, roomMap: RoomMap) {
    if (roomMap.entityCountMap.bigDemoEntity) room.addEntity(CreateEntity(bigDemoEntity, room))
    if (roomMap.entityCountMap.demoEntity) room.addEntity(CreateEntity(demoEntity, room))
    if (roomMap.entityCountMap.growthDemoEntity) room.addEntity(CreateEntity(growthDemoEntity, room))
    createBounds(engine, room)
}

function loadSystems(room: Room, roomMap: RoomMap): void {
    if (roomMap.systemMap.movement) room.addSystem(new MovementSystem(room))
    if (roomMap.systemMap.physics) room.addSystem(new PhysicsSystem(room))
    if (roomMap.systemMap.render) room.addSystem(new RenderSystem(room))
}

function setBounds(entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void {
    const { position, size } = entity.options
    position.x = positionX
    position.y = positionY
    size.x = sizeX
    size.y = sizeY
}