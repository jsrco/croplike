import * as PIXI from 'pixi.js'
import { Component } from "../components/component"

export class Entity extends PIXI.Container {
    private components: { [name: string]: Component } = {}
    
    public addComponent(component: Component): void {
        this.components[component.name] = component
        this.addChild(component as any)
    }

    public removeComponent(name: string): void {
        const component = this.components[name]
        if (component) {
            this.removeChild(component as any)
            delete this.components[name]
        }
    }

    public getComponent<T extends Component>(name: string): T {
        return this.components[name] as T
    }

    public update(delta: number): void {
        for (const component of Object.values(this.components)) {
            component.update(delta)
        }
    }
}
