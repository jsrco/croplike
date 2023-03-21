import { CollisionComponent, GraphicsComponent, GravityComponent, JumpComponent, PositionComponent, SizeComponent, VelocityComponent, WallCollisionComponent, WallComponent } from "../components"
import { World } from "../util/World"
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
    options?: {
        graphics: {
            color?: number
        }
        position: {
            x?: number,
            y?: number
        }
        size: {
            height?: number
            width?: number
        }
    }
}

export const createEntity = (entityMap: EntityMap, world: World): Entity => {
    const entity = new Entity(entityMap.name)
    const components = []
   
    if (entityMap.componentMap.collision) components.push(new CollisionComponent(world))
    if (entityMap.componentMap.graphics) components.push(new GraphicsComponent(world, entityMap.options?.graphics.color))
    if (entityMap.componentMap.gravity) components.push(new GravityComponent(world))
    if (entityMap.componentMap.jump) components.push(new JumpComponent(world))
    if (entityMap.componentMap.position) components.push(new PositionComponent(world))
    if (entityMap.componentMap.size) components.push(new SizeComponent(world, entityMap.options?.size.height, entityMap.options?.size.width))
    if (entityMap.componentMap.velocity) components.push(new VelocityComponent(world))
    if (entityMap.componentMap.wallCollision) components.push(new WallCollisionComponent(world))
    if (entityMap.componentMap.wall) components.push(new WallComponent(world))
    
    entity.addComponents(components)

    return entity
}