import { Entity } from "../entities/entity"

export class System {
    componentByEntity: { [key: string]: string[] } = {}
    entities: Entity[] = []
    entityByComponent: { [key: string]: Entity[] } = {}
    addEntity(entity: Entity) {
        this.entities.push(entity)
        for (let componentName in entity.components) {
            if (!this.entityByComponent[componentName]) {
                this.entityByComponent[componentName] = []
            }
            this.entityByComponent[componentName].push(entity)
            if (!this.componentByEntity[entity.id]) {
                this.componentByEntity[entity.id] = []
            }
            this.componentByEntity[entity.id].push(componentName)
        }
    }
    getEntitiesByComponent(componentNames: string[]) {
        const result: Entity[] = []
        if (componentNames.length === 0) {
            return this.entities
        }
        let entities: Entity[] = []
        for (let componentName of componentNames) {
            if (!this.entityByComponent[componentName]) {
                return []
            }
            entities.push(...this.entityByComponent[componentName])
        }
        entities = entities.filter((entity, index, self) => {
            return self.indexOf(entity) === index
        })
        for (let entity of entities) {
            let hasAllComponents = true
            for (let componentName of componentNames) {
                if (!entity.components[componentName]) {
                    hasAllComponents = false
                    break
                }
            }
            if (hasAllComponents) {
                result.push(entity)
            }
        }
        return result
    }
    removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity)
        this.entities.splice(index, 1)
        for (let componentName of this.componentByEntity[entity.id]) {
            const entitiesWithComponent = this.entityByComponent[componentName]
            delete entitiesWithComponent[entitiesWithComponent.indexOf(entity)]
        }
        delete this.componentByEntity[entity.id]
    }
    update(delta: number) {
        for (let componentName in this.entitiesByComponent) {
            const componentEntities = this.entitiesByComponent[componentName]
            for (let entityId of componentEntities) {
                const entity = this.entities[entityId]
                const component = entity.getComponent(componentName)
                component.update(delta)
            }
        }
    }
}
