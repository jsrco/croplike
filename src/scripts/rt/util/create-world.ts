import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../engine"
import { CreateEntity, EntityMap } from "../entities/create-entity"
import { wall } from "../entities/templates-entity"
import { MovementSystem } from "../systems/movement"
import { PhysicsSystem } from "../systems/physics"
import { RenderSystem } from "../systems/render"
import { World } from "./world"

export type WorldMap = {
    entities: Array<EntityMap>
    worldDimensions: RAPIER.Vector2
    systemMap: SystemMap
    options?: any
}

export type SystemMap = {
    movement?: boolean,
    physics?: boolean,
    render?: boolean, 
}

const createBounds = (world: World, worldMap: WorldMap): void => {
    const { worldDimensions } = worldMap
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

    for (let index = 0; index < entities.length; index++ ) {
        if (entities[index].name === 'player')  {
            engine.player = CreateEntity(entities[index], world)
            world.addEntity(engine.player)
        }
        if (entities[index].name === 'bigDemo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'demo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'growthDemo') world.addEntity(CreateEntity(entities[index], world))
    }
    createBounds(world, worldMap)
}

export const CreateWorld = (engine: Engine, worldMap: WorldMap): World => {
    const { worldDimensions } = worldMap
    const world = new World(engine, { worldDimensions })
   
    createEntities(engine, world, worldMap)
    loadSystems(world, worldMap)

    return world
}

const loadSystems = (world: World, worldMap: WorldMap): void => {
    if (worldMap.systemMap.movement) world.addSystem(new MovementSystem(world))
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