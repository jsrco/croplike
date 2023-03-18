import { Entity } from "../entities/Entity"
import { World } from "../util/World"

export class System {
    private componentEntityMap: Map<string, Entity[]> = new Map()
    type!: string
    world: World

    constructor(world: World) {
        this.world = world
    }
    private cacheEntities(componentTypes: string[], entities: Entity[]): void {
        const cacheKey = componentTypes.join(',')
        this.componentEntityMap.set(cacheKey, entities)
    }
    clearCache(): void {
        this.componentEntityMap.clear()
    }
    private getCachedEntities(componentTypes: string[]): Entity[] | undefined {
        const cacheKey = componentTypes.join(',')
        return this.componentEntityMap.get(cacheKey)
    }
    getEntitiesByComponent(...componentTypes: string[]): Entity[] {
        const cachedEntities = this.getCachedEntities(componentTypes)
        if (cachedEntities) {
            return cachedEntities
        }
        const newEntities = this.world.getEntitiesByComponent(...componentTypes)
        this.cacheEntities(componentTypes, newEntities)
        return newEntities
    }
    removeEntityFromCache(entity: Entity): void {
        for (const [cacheKey, entities] of this.componentEntityMap.entries()) {
            if (cacheKey.split(',').every(type => entity.hasComponent(type))) {
                const index = entities.indexOf(entity)
                if (index !== -1) {
                    entities.splice(index, 1)
                    this.componentEntityMap.set(cacheKey, entities)
                }
            }
        }
    }
    update(deltaTime: number): void {
        // Override this method in each subclass
    }
}
