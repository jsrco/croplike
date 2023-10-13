import { v4 as uuidv4 } from 'uuid'
import { Component } from "../components/component"

export class Entity {

  components: Record<string, Component>
  id: string
  name: string

  constructor(name: string, id?: string) {
    this.components = {}
    this.id = id ? id : uuidv4()
    this.name = name
  }

  addComponent(component: Component): void {
    this.components[component.type] = component
    component.owner = this
  }

  addComponents(components: Component[]): void {
    components.forEach((component) => {
      this.addComponent(component)
      component.owner = this
    })
  }

  getComponent(componentType: string): Component | undefined {
    return this.components[componentType]
  }

  hasComponent(componentType: string): boolean {
    return this.components.hasOwnProperty(componentType)
  }

  removeComponent(componentType: string): void {
    delete this.components[componentType]
  }

}
