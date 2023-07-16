import { Entity } from "./Entity"
import { CollisionComponent } from "../components/collision"
import { GraphicsComponent } from "../components/graphics"
import { PositionComponent } from "../components/position"
import { SizeComponent } from "../components/size"
import { VelocityComponent } from "../components/velocity"
import { World } from "../util/World"


export type EntityMap = {
    name: string
    componentMap: {
        collision?: boolean
        graphics?: boolean
        position?: boolean
        size?: boolean
        velocity?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name)
    const components = []
    
    if (entityMap.componentMap.collision) components.push(new CollisionComponent(entity, world,  entityMap.options?.position?.x || 0, entityMap.options?.position?.y || 0))
    if (entityMap.componentMap.graphics) components.push(new GraphicsComponent(entity, world, entityMap.options?.graphics?.color))
    if (entityMap.componentMap.position) components.push(new PositionComponent(entity, world, entityMap.options?.position?.x || 0, entityMap.options?.position?.y || 0))
    if (entityMap.componentMap.size) components.push(new SizeComponent(entity, world, entityMap.options?.size?.width, entityMap.options?.size?.height))
    if (entityMap.componentMap.velocity) components.push(new VelocityComponent(entity, world, entityMap.options?.velocity?.x, entityMap.options?.velocity?.y))

    entity.addComponents(components)

    return entity
}