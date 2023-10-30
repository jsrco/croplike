import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { World } from "../util/world"
import { Entity } from "./entity"

export type EntityMap = {
    id?: string
    name: string
    componentMap: {
        pixi?: boolean
        rapier?: boolean
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
    if (entityMap.componentMap.rapier)
        components.push(
            new RapierComponent(entity, world, entityMap.options)
        )
    entity.addComponents(components)
    return entity
}
