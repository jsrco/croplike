import { Entity } from "../entities/Entity"
import { World } from "../util/World"

export class System {
    componentEntityMap: Map<string, Entity[]> = new Map()
    type!: string
    world: World

    constructor(world: World) {
        this.world = world
    }
    // Method to cache entities
    cacheEntities(componentTypes: string[], entities: Entity[]): void {
        const cacheKey = componentTypes.join(',')
        this.componentEntityMap.set(cacheKey, entities)
    }
    // Method to clear the cache
    clearCache(): void {
        this.componentEntityMap.clear()
    }
    // Method to get cached entities
    getCachedEntities(componentTypes: string[]): Entity[] | undefined {
        const cacheKey = componentTypes.join(',')
        return this.componentEntityMap.get(cacheKey)
    }
    getSystemEntitiesByComponent(...componentTypes: string[]): Entity[] {
        const cachedEntities = this.getCachedEntities(componentTypes)
        if (cachedEntities) {
            return cachedEntities
        }
        const newEntities = this.world.getEntitiesByComponent(...componentTypes)
        this.cacheEntities(componentTypes, newEntities)
        return newEntities
    }
    update(deltaTime: number): void {
        // Override this method in each subclass
    }
}
