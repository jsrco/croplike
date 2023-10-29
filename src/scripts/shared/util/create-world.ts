import RAPIER from "@dimforge/rapier2d"
import { EntityMap } from "../entities/create-entity"
import { MovementSystemRT } from "../systems/movement-rt"
import { MovementSystemTB } from "../systems/movement-tb"
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
    movementRT?: boolean,
    movementTB?: boolean,
    physics?: boolean,
    render?: boolean,
}

export const loadSystems = (world: World, worldMap: WorldMap): void => {
    if (worldMap.systemMap.movementRT) world.addSystem(new MovementSystemRT(world))
    if (worldMap.systemMap.movementTB) world.addSystem(new MovementSystemTB(world))
    if (worldMap.systemMap.physics) world.addSystem(new PhysicsSystem(world))
    if (worldMap.systemMap.render) world.addSystem(new RenderSystem(world))
}