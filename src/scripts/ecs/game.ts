import * as PIXI from 'pixi.js'
import { RenderingComponent } from './components/component-rendering'
import { Entity } from "./entities/entity"
import { System } from "./systems/system"

export class Game {
    app: PIXI.Application
    entityManager: EntityManager
    system: System
  
    constructor(app: PIXI.Application ) {
      this.app = app
      this.system = new System()
    }
  
    createEntity(entityType: string, x: number, y: number, animationFrames: PIXI.Texture[], animationSpeed: number) {
      const entity = new Entity(entityType, x, y, animationFrames[0].width, animationFrames[0].height)
      const renderingComponent = new RenderingComponent(animationFrames, animationSpeed)
      entity.addComponent(renderingComponent)
      this.system.addEntity(entity)
      this.app.stage.addChild(renderingComponent.sprite)
      return entity
    }
  
    update(delta: number) {
      this.system.update(delta)
      for (let entityId in this.system.entities) {
        const entity = this.system.entities[entityId]
        const renderingComponent = entity.getComponent("rendering") as RenderingComponent
        if (renderingComponent) {
          renderingComponent.sprite.x = entity.x
          renderingComponent.sprite.y = entity.y
        }
      }
    }
  }
  