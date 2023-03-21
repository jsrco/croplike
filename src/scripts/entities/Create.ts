import { Entity } from "./Entity"

export type EntityMap = {
    name: string
    componentMap: {
        collision: boolean
        graphics: boolean
        gravity: boolean
        jump: boolean
        position: boolean
        size: boolean
        velocity: boolean
        wallCollision: boolean
        wall: boolean
    }
}

export const CreateEntity = (entityMap: EntityMap): Entity => {
    const entity = new Entity(entityMap.name)
    // map components
    return entity
}