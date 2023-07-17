import { RapierComponent } from "../components/rapier"
import { ThreeComponent } from "../components/three"
import { World } from "../util/World"
import { Entity } from "./Entity"

export type EntityMap = {
    name: string
    componentMap: {
        rapier?: boolean
        three?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name)
    const components = []

    if (entityMap.componentMap.rapier)
        components.push(
            new RapierComponent(entity, world, entityMap.options)
        )
    if (entityMap.componentMap.three)
        components.push(
            new ThreeComponent(entity, world, entityMap.options)
        )

    entity.addComponents(components)

    return entity
}
