import * as PIXI from 'pixi.js'
import { Component } from '../components/component'

export class Entity extends PIXI.Rectangle {
    id: number
    components: { [key: string]: Component } = {}
    entityType: string
  
    constructor(type: string, x: number, y: number, width: number, height: number) {
      super(x, y, width, height)
      this.id = Date.now()
      this.entityType = type
    }
  
    addComponent(component: Component) {
      this.components[component.name] = component
    }
  
    removeComponent(componentName: string) {
      delete this.components[componentName]
    }
  
    getComponent(componentName: string): Component {
      return this.components[componentName]
    }
  }
  