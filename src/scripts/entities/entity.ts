import { Component } from "../components/Component"

export class Entity {

  components: Record<string, Component>
  id: number
  name: string

  constructor(name: string) {
    this.components = {}
    this.id = new Date().getTime()
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
