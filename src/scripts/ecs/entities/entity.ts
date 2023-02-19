import * as PIXI from 'pixi.js'
import { Component } from "../components/component"

export class Entity extends PIXI.Container {
    private readonly components: Map<string, Component> = new Map<string, Component>()

    public addComponent(component: Component): void {
        this.components.set(component.name, component)
    }
    public getComponent<T extends Component>(name: string): T {
        return this.components.get(name) as T
    }
    public hasComponent(name: string): boolean {
        return this.components.has(name)
    }
    public removeComponent(name: string): void {
        this.components.delete(name)
    }
}

