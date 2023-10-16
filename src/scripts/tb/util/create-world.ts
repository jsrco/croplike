import { Engine } from "../../shared/engine"
import { CreateEntity, EntityMap } from "../../shared/entities/create-entity"
import { wall } from "../../shared/entities/templates-entity"
import { MovementSystemTB } from "../../shared/systems/movement-tb"
import { PhysicsSystem } from "../../shared/systems/physics"
import { RenderSystem } from "../../shared/systems/render"
import { WorldMap } from "../../shared/util/create-world"
import { World } from "../../shared/util/world"

export const createBounds = (world: World): void => {
    const { worldDimensions } = world
    // floor
    setBounds(wall, 0, worldDimensions.y - world.wallSize, worldDimensions.x, world.wallSize)
    world.addEntity(CreateEntity(wall, world))
    // leftWall
    setBounds(wall, 0, world.wallSize, world.wallSize, worldDimensions.y - (world.wallSize * 2))
    world.addEntity(CreateEntity(wall, world))
    // rightWall
    setBounds(wall, worldDimensions.x - world.wallSize, world.wallSize, world.wallSize, worldDimensions.y - (world.wallSize * 2))
    world.addEntity(CreateEntity(wall, world))
    // ceiling
    setBounds(wall, 0, 0, worldDimensions.x, world.wallSize)
    world.addEntity(CreateEntity(wall, world))
}

const createEntities = (engine: Engine, world: World, worldMap: WorldMap): void => {
    const { entities } = worldMap

    for (let index = 0; index < entities.length; index++ ) {
        if (entities[index].name === 'player')  {
            engine.player = CreateEntity(entities[index], world)
            world.addEntity(engine.player)
        }
    }
    createBounds(world)
}

export const CreateWorld = (engine: Engine, worldMap: WorldMap): World => {
    const { worldDimensions } = worldMap
    const world = new World(engine, { worldDimensions })
   
    createEntities(engine, world, worldMap)
    loadSystems(world, worldMap)

    return world
}

const loadSystems = (world: World, worldMap: WorldMap): void => {
    if (worldMap.systemMap.movementTB) world.addSystem(new MovementSystemTB(world))
    if (worldMap.systemMap.physics) world.addSystem(new PhysicsSystem(world))
    if (worldMap.systemMap.render) world.addSystem(new RenderSystem(world))
}

const setBounds = (entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void => {
    const { position, size } = entity.options
    position.x = positionX
    position.y = positionY
    size.x = sizeX
    size.y = sizeY
}