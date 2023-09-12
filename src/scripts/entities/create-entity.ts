import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { Entity } from "./entity"
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
        // check for position and adjust here
        // const yPos = position.y && position.y + size.y / 2 <= this.room.roomDimensions.y ? position.y : this.room.roomDimensions.y - this.room.wallSize - (size.y / 2)
        components.push(
            new RapierComponent(entity, room, entityMap.options)
        )
    entity.addComponents(components)
    return entity
}
