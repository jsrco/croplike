import { Entity } from '../entities/Entity'
import { System } from '../systems/System'
import { EventSystem } from './EventSystem'

export class EntityManager {
    private entities: Entity[] = []
    private systems: System[] = []

    public addEntity(entity: Entity): void {
        this.entities.push(entity)
    }
    public addSystem(system: System): void {
        this.systems.push(system)
    }
    public getEntitiesWithComponent(componentName: string): Entity[] {
        return this.entities.filter(entity => entity.hasComponent(componentName))
    }
    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity)
        if (index >= 0) {
            this.entities.splice(index, 1)
        }
    }
    public removeSystem(system: System): void {
        const index = this.systems.indexOf(system)
        if (index >= 0) {
            this.systems.splice(index, 1)
        }
    }
    public update(delta: number): void {
        for (const system of this.systems) {
            system.update(delta, this.entities)
        }
    }
    public updateWithEvents(delta: number, eventSystem: EventSystem): void {
        for (const system of this.systems) {
            if (system.updateWithEvents) {
                system.updateWithEvents(delta, this.entities, eventSystem)
            } else {
                system.update(delta, this.entities)
            }
        }
    }
}