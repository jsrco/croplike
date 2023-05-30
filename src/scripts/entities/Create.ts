import { CollisionComponent, GraphicsComponent, GravityComponent, JumpComponent, PositionComponent, SizeChangeComponent, SizeComponent, VelocityComponent, WallCollisionComponent, WallComponent } from "../components"
import { OutOfBoundsComponent } from "../components/outOfBoundsComponent"
import { World } from "../util/World"
import { Entity } from "./Entity"

export type EntityMap = {
    name: string
    componentMap: {
        collision?: boolean
        graphics?: boolean
        gravity?: boolean
        jump?: boolean
        outOfBounds?: boolean,
        position?: boolean
        size?: boolean
        sizeChange?: boolean
        velocity?: boolean
        wallCollision?: boolean
        wall?: boolean
    }
    options?: any
}

export const CreateEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name)
    const components = []
   
    if (entityMap.componentMap.collision) components.push(new CollisionComponent(entity, world))
    if (entityMap.componentMap.graphics) components.push(new GraphicsComponent(entity, world, entityMap.options?.graphics?.color))
    if (entityMap.componentMap.gravity) components.push(new GravityComponent(entity, world, entityMap.options?.gravity?.force))
    if (entityMap.componentMap.jump) components.push(new JumpComponent(entity, world))
    if (entityMap.componentMap.outOfBounds) components.push(new OutOfBoundsComponent(entity, world))
    if (entityMap.componentMap.position) components.push(new PositionComponent(entity, world, entityMap.options?.position?.x || 0, entityMap.options?.position?.y || 0))
    if (entityMap.componentMap.size) components.push(new SizeComponent(entity, world, entityMap.options?.size?.width, entityMap.options?.size?.height))
    if (entityMap.componentMap.sizeChange) components.push(new SizeChangeComponent(entity, world))
    if (entityMap.componentMap.velocity) components.push(new VelocityComponent(entity, world, entityMap.options?.velocity?.x, entityMap.options?.velocity?.y))
    if (entityMap.componentMap.wallCollision) components.push(new WallCollisionComponent(entity, world))
    if (entityMap.componentMap.wall) components.push(new WallComponent(entity, world))
    
    entity.addComponents(components)

    return entity
}