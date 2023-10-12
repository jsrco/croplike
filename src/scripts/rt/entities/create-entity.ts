import { Entity } from "../../shared/entities/entity"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { Room } from "../util/room"

export type EntityMap = {
    id?: string
    name: string
    componentMap: {
        pixi?: boolean
        rapier?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, room: Room): Entity => {
    const entity = new Entity(entityMap.name, entityMap.id)
    const components = []
    if (entityMap.componentMap.pixi)
        components.push(
            new PixiComponent(entity, room, entityMap.options)
        )
    if (entityMap.componentMap.rapier)
        components.push(
            new RapierComponent(entity, room, entityMap.options)
        )
    entity.addComponents(components)
    return entity
}
