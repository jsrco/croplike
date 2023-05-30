import { CreateEntity, EntityMap } from "../entities/Create"
import { Entity } from "../entities/Entity"
import { World } from "./World"

export class SaveManager {
    data: any
    constructor() {
        this.data = {
            entities: []
        }
    }
    clearData(): void {
        this.data = {
            entities: []
        }
    }
    createData(): void {
        // create all the data for load
    }
    createAllEntityData(world: World): void {
        for (const entity in world.entities) {
            this.data.entities.push(this.createEntityData(world.entities[entity]))   
        }
    }  
    createEntityData(entity: Entity): EntityMap {
        const entityMap: any = {
            name: entity.name,
            componentMap: {},
            options: {},
        }
        for (const compontent in entity.components) {
            const targetComponent = entity.components[compontent]
            entityMap.componentMap[targetComponent.type] = true
            entityMap.options[targetComponent.type] = targetComponent.copyComponentData(targetComponent)
        }
        return entityMap
    }  
    getData() {
        return this.data
    }
    loadEntity(entityMap: EntityMap, world:World) {
        const entity = CreateEntity(entityMap, world)
        world.addEntity(entity)
        // if (entityMap.componentMap.collision) entity.components.collision.applyComponentData(entityMap.options?.collision) find fix
        // if (entityMap.componentMap.graphics) entity.components.graphics.applyComponentData(entityMap.options?.graphics) find fix
        if (entityMap.componentMap.gravity) entity.components.gravity.applyComponentData(entityMap.options?.gravity)
        if (entityMap.componentMap.jump) entity.components.jump.applyComponentData(entityMap.options?.jump)
        if (entityMap.componentMap.outOfBounds) entity.components.position.applyComponentData(entityMap.options?.outOfBounds)
        if (entityMap.componentMap.position) entity.components.position.applyComponentData(entityMap.options?.position)
        if (entityMap.componentMap.size) entity.components.size.applyComponentData(entityMap.options?.size)
        if (entityMap.componentMap.sizeChange) entity.components.sizeChange.applyComponentData(entityMap.options?.sizeChange)
        if (entityMap.componentMap.velocity) entity.components.velocity.applyComponentData(entityMap.options?.velocity)
        if (entityMap.componentMap.wallCollision) entity.components.wallCollision.applyComponentData(entityMap.options?.wallCollision)
        if (entityMap.componentMap.wall) entity.components.wall.applyComponentData(entityMap.options?.wall)
    }
}
