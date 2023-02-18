import * as PIXI from 'pixi.js'
import { Component } from '../components/component'

export class Entity extends PIXI.Rectangle {
    components: { [key: string]: Component } = {}
    entityType: string
    id: number
  
    constructor(type: string, x: number, y: number, width: number, height: number) {
      super(x, y, width, height)
      this.entityType = type
      this.id = Date.now()
    }
    addComponent(component: Component) {
      this.components[component.name] = component
      component.owner = this
    }
    getComponent(componentName: string): Component {
      return this.components[componentName]
    }
    removeComponent(componentName: string) {
      delete this.components[componentName]
    }
  }
  