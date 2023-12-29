import { MovementComponent } from "../components/movement"
import { PixiComponent } from "../components/pixi"
import { PositionComponent } from "../components/position"
import { RapierComponent } from "../components/rapier"
import { SizeComponent } from "../components/size"
import { World } from "../util/world"
import { Entity } from "./entity"

export type EntityMap = {
    id?: string
    name: string
    componentMap: {
        movement?: boolean
        pixi?: boolean
        position?: boolean
        rapier?: boolean
        size?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name, entityMap.id)
    const components = []
    if (entityMap.componentMap.movement)
        components.push(
            new MovementComponent(entity, world, entityMap.options)
        )
    if (entityMap.componentMap.pixi)
        components.push(
            new PixiComponent(entity, world, entityMap.options)
        )
    if (entityMap.componentMap.position)
        components.push(
            new PositionComponent(entity, world, entityMap.options)
        )
    if (entityMap.componentMap.rapier)
        components.push(
            new RapierComponent(entity, world, entityMap.options)
        )
    if (entityMap.componentMap.size)
        components.push(
            new SizeComponent(entity, world, entityMap.options)
        )
    entity.addComponents(components)
    return entity
}
