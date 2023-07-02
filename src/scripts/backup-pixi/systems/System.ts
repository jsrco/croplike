import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

export class System {
    componentEntityMap: Map<string, Entity[]> = new Map()
    keys: Set<string>
    type!: string
    world: World

    constructor(world: World) {
        this.keys = new Set<string>()
        this.world = world
        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }
    cacheEntities(componentTypes: string[], entities: Entity[]): void {
        const cacheKey = componentTypes.join(',')
        this.componentEntityMap.set(cacheKey, entities)
    }
    clearCache(): void {
        this.componentEntityMap.clear()
    }
    getCachedEntities(componentTypes: string[]): Entity[] | undefined {
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
    onKeyChange(data: any): void {
        const { key, isDown } = data
        if (isDown) {
            this.keys.add(key)
        } else {
            this.keys.delete(key)
        }
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
