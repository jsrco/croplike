import { Vector2 } from "@dimforge/rapier2d"
import { Engine } from "../engine"
import { CreateEntity, EntityMap } from "../entities/create-entity"
import { MovementSystemRT } from "../systems/movement-rt"
import { MovementSystemTB } from "../systems/movement-tb"
import { PhysicsSystem } from "../systems/physics"
import { RenderSystem } from "../systems/render"
import { ColorSwatch } from "./color-swatch"
import { World } from "./world"


export type WorldMap = {
    entities: Array<EntityMap>
    worldDimensions: Vector2
    systemMap: SystemMap
    options?: any
}

export type SystemMap = {
    movementRT?: boolean,
    movementTB?: boolean,
    physics?: boolean,
    render?: boolean,
}

const createBounds = (world: World): void => {
    const { engine, wallSize } = world
    const { x, y } = world.worldDimensions
    const createBound = (name: string, position: Vector2, size: Vector2) => {
        const bound = setBoundsMap(position, size, world.engine.name === 'Hunts')
        bound.name = name
        world.addEntity(CreateEntity(bound, world))
    }
    if (engine.name === "Hunts") {
        createBound('floor', new Vector2(x / 2, y - wallSize / 2), new Vector2(x, wallSize))
        createBound('leftWall', new Vector2(wallSize / 2, y / 2), new Vector2(wallSize, y - 2 * wallSize))
        createBound('rightWall', new Vector2(x - wallSize / 2, y / 2), new Vector2(wallSize, y - 2 * wallSize))
        createBound('ceiling', new Vector2(x / 2, wallSize / 2), new Vector2(x, wallSize))
    }
    if (engine.name === "Fields") {
        createBound('floor', new Vector2(0, y - wallSize), new Vector2(x, wallSize))
        createBound('leftWall', new Vector2(0, wallSize), new Vector2(wallSize, y - 2 * wallSize))
        createBound('rightWall', new Vector2(x - wallSize, wallSize), new Vector2(wallSize, y - 2 * wallSize))
        createBound('ceiling', new Vector2(0, 0), new Vector2(x, wallSize))
    }
}

const createEntities = (engine: Engine, world: World, worldMap: WorldMap): void => {
    const { entities } = worldMap
    createBounds(world)
    for (let index = 0; index < entities.length; index++) {
        if (entities[index].name === 'player') {
            engine.player = CreateEntity(entities[index], world)
            world.addEntity(engine.player)
        }
        if (entities[index].name === 'bigDemo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'demo') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'dummy') world.addEntity(CreateEntity(entities[index], world))
        if (entities[index].name === 'growthDemo') world.addEntity(CreateEntity(entities[index], world))
    }
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
    if (worldMap.systemMap.movementTB) world.addSystem(new MovementSystemTB(world))
    if (worldMap.systemMap.physics) world.addSystem(new PhysicsSystem(world))
    if (worldMap.systemMap.render) world.addSystem(new RenderSystem(world))
}

const setBoundsMap = (position: Vector2, size: Vector2, isItHunts: boolean): EntityMap => {
    const wall: EntityMap = {
        name: 'wall',
        componentMap: {
            pixi: true,
            position: true,
            rapier: isItHunts,
            size: true,
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
