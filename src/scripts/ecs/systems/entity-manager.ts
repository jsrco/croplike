import { Entity } from "../entities/entity"
import { System } from './system'

export class EntityManager {
    private entities: Entity[] = []
    private systems: System[] = []
    private entityComponentMap: { [componentName: string]: Entity[] } = {};

    public addEntity(entity: Entity): void {
        this.entities.push(entity)
        entity.update(0)
        // Add the entity to the appropriate component map entries
        for (const [name, component] of Object.entries(entity['components'])) {
            const componentEntities = this.entityComponentMap[name] || []
            componentEntities.push(entity)
            this.entityComponentMap[name] = componentEntities
        }
        // Add the entity to any systems that require its components
        for (const system of this.systems) {
            if (this.entityHasComponents(entity, system.components)) {
                system.addEntity(entity)
            }
        }
    }
    public addSystem(system: System): void {
        this.systems.push(system)
        // Add any entities that match the system's required components
        for (const entity of this.entities) {
            if (this.entityHasComponents(entity, system.components)) {
                system.addEntity(entity)
            }
        }
    }
    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity)
        if (index !== -1) {
            this.entities.splice(index, 1)
            entity.update(0)
            // Remove the entity from the appropriate component map entries
            for (const [name, component] of Object.entries(entity['components'])) {
                const componentEntities = this.entityComponentMap[name] || []
                const componentIndex = componentEntities.indexOf(entity)
                if (componentIndex !== -1) {
                    componentEntities.splice(componentIndex, 1)
                    this.entityComponentMap[name] = componentEntities
                }
            }
            // Remove the entity from any systems that contain it
            for (const system of this.systems) {
                system.removeEntity(entity)
            }
        }
    }
    public removeSystem(system: System): void {
        const index = this.systems.indexOf(system)
        if (index !== -1) {
            this.systems.splice(index, 1)
            // Remove all entities from the system
            for (const entity of system.entities) {
                system.removeEntity(entity)
            }
        }
    }
    public entityHasComponents(entity: Entity, components: string[]): boolean {
        for (const component of components) {
            if (!entity.getComponent(component)) {
                return false
            }
        }
        return true
    }    
    public getEntitiesWithComponent(componentName: string): Entity[] {
        return this.entityComponentMap[componentName] || []
    }
    public update(delta: number): void {
        for (const system of this.systems) {
            system.update(delta)
        }
    }
}