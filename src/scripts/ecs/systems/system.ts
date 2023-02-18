import { Entity } from "../entities/entity";

export class System {
    entities: { [key: number]: Entity } = {};
    entitiesByComponent: { [key: string]: number[] } = {};
  
    addEntity(entity: Entity) {
      this.entities[entity.id] = entity;
      for (let componentName in entity.components) {
        if (!this.entitiesByComponent[componentName]) {
          this.entitiesByComponent[componentName] = [];
        }
        this.entitiesByComponent[componentName].push(entity.id);
      }
    }
  
    removeEntity(entity: Entity) {
      delete this.entities[entity.id];
      for (let componentName in entity.components) {
        const index = this.entitiesByComponent[componentName].indexOf(entity.id);
        this.entitiesByComponent[componentName].splice(index, 1);
      }
    }
  
    update(delta: number) {
      for (let componentName in this.entitiesByComponent) {
        const componentEntities = this.entitiesByComponent[componentName];
        for (let entityId of componentEntities) {
          const entity = this.entities[entityId];
          const component = entity.getComponent(componentName);
          component.update(delta);
        }
      }
    }
  }
  