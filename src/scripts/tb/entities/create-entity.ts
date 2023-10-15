import { PixiComponent } from "../components/pixi"
import { World } from "../util/world"
import { Entity } from "./entity"
import { wall } from "./templates-entity"

export type EntityMap = {
    id?: string
    name: string
    componentMap: {
        pixi?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name, entityMap.id)
    const components = []
    if (entityMap.componentMap.pixi)
        components.push(
            new PixiComponent(entity, world, entityMap.options)
        )
    entity.addComponents(components)
    return entity
}

export const createBounds = (world: World): void => {
    const { worldDimensions } = world
    // floor
    setBounds(wall, worldDimensions.x / 2, worldDimensions.y - (20 / 2), worldDimensions.x, 20)
    world.addEntity(CreateEntity(wall, world))
    // leftWall
    setBounds(wall, 20 / 2, (worldDimensions.y / 2), 20, worldDimensions.y - (20 * 2))
    world.addEntity(CreateEntity(wall, world))
    // rightWall
    setBounds(wall, worldDimensions.x - (20 / 2), (worldDimensions.y / 2), 20, worldDimensions.y - (20 * 2))
    world.addEntity(CreateEntity(wall, world))
    // ceiling
    setBounds(wall, worldDimensions.x / 2, 20 / 2, worldDimensions.x, 20)
    world.addEntity(CreateEntity(wall, world))
}

const setBounds = (entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void => {
    const { position, size } = entity.options
    position.x = positionX
    position.y = positionY
    size.x = sizeX
    size.y = sizeY
}