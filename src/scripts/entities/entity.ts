import { Component } from "../components/component"

export class Entity {
  id: number
  name: string
  components: Record<string, Component>

  constructor(name: string) {
    this.id = new Date().getTime()
    this.name = name
    this.components = {}
  }

  addComponent(component: Component): void {
    this.components[component.type] = component
  }
  addComponents(components: Component[]): void {
    components.forEach((component) => {
      this.addComponent(component)
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
