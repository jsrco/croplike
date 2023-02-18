import * as PIXI from 'pixi.js'
import { Component } from '../components/component'

export class Entity extends PIXI.Container {
    components: { [key: string]: Component } = {}
    entityType: string
    id: number
  
    constructor(type: string) {
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
  