import { Engine } from "../../shared/engine"
import { CreateEntity, EntityMap } from "../../shared/entities/create-entity"
import { MovementSystemRT } from "../../shared/systems/movement-rt"
import { PhysicsSystem } from "../../shared/systems/physics"
import { RenderSystem } from "../../shared/systems/render"
import { WorldMap } from "../../shared/util/create-world"
import { World } from "../../shared/util/world"
import { wall } from "../entities/templates-entity"

export const createBounds = (world: World): void => {
    const { worldDimensions } = world
    // floor
    setBounds(wall, worldDimensions.x / 2, worldDimensions.y - (world.wallSize / 2), worldDimensions.x, world.wallSize)
    world.addEntity(CreateEntity(wall, world))
    // leftWall
    setBounds(wall, world.wallSize / 2, (worldDimensions.y / 2), world.wallSize, worldDimensions.y - (world.wallSize * 2))
    world.addEntity(CreateEntity(wall, world))
    // rightWall
    setBounds(wall, worldDimensions.x - (world.wallSize / 2), (worldDimensions.y / 2), world.wallSize, worldDimensions.y - (world.wallSize * 2))
    world.addEntity(CreateEntity(wall, world))
    // ceiling
    setBounds(wall, worldDimensions.x / 2, world.wallSize / 2, worldDimensions.x, world.wallSize)
    world.addEntity(CreateEntity(wall, world))
}

const createEntities = (engine: Engine, world: World, worldMap: WorldMap): void => {
    const { entities } = worldMap

    for (let index = 0; index < entities.length; index++) {
        if (entities[index].name === 'player') {
            engine.player = CreateEntity(entities[index], world)
            world.addEntity(engine.player)
        }
        if (entities[index].name === 'bigDemo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'demo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'growthDemo') world.addEntity(CreateEntity(entities[index], world))
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
    if (worldMap.systemMap.movementRT) world.addSystem(new MovementSystemRT(world))
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