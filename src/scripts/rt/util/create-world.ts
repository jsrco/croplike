import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../../shared/engine"
import { CreateEntity, EntityMap } from "../../shared/entities/create-entity"
import { MovementSystemRT } from "../../shared/systems/movement-rt"
import { PhysicsSystem } from "../../shared/systems/physics"
import { RenderSystem } from "../../shared/systems/render"
import { ColorSwatch } from "../../shared/util/color-swatch"
import { WorldMap } from "../../shared/util/create-world"
import { World } from "../../shared/util/world"

export const createBounds = (world: World): void => {
    const { wallSize } = world
    const { x, y } = world.worldDimensions
    // floor
    const floor = setBoundsMap(new RAPIER.Vector2(x / 2, y - (wallSize / 2)), new RAPIER.Vector2(x, wallSize))
    world.addEntity(CreateEntity(floor, world))
    // leftWall
    const leftWall = setBoundsMap(new RAPIER.Vector2(wallSize / 2, (y / 2)), new RAPIER.Vector2(wallSize, y - (2 * wallSize)))
    world.addEntity(CreateEntity(leftWall, world))
    // rightWall
    const rightWall = setBoundsMap(new RAPIER.Vector2(x - (wallSize / 2), (y / 2)), new RAPIER.Vector2(wallSize, y - (2 * wallSize)))
    world.addEntity(CreateEntity(rightWall, world))
    // ceiling
    const ceiling = setBoundsMap(new RAPIER.Vector2(x / 2, wallSize / 2), new RAPIER.Vector2(x, wallSize))
    world.addEntity(CreateEntity(ceiling, world))
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

const setBoundsMap = (position: RAPIER.Vector2, size: RAPIER.Vector2): EntityMap => {
    const wall: EntityMap = {
        name: 'wall',
        componentMap: {
            pixi: true,
            rapier: true,
        },
        options: {
            bodyType: 'fixed',
            color: ColorSwatch.blue[3],
            isOnGround: true,
            position: position,
            size: size,
        },
    }

    return wall
}