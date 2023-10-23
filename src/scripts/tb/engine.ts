import RAPIER from "@dimforge/rapier2d"
import { Engine } from "../shared/engine"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { RenderSystem } from "./../shared/systems/render"
import { World } from "./../shared/util/world"
import { CreateWorld } from "./util/create-world"
import { startWorld } from "./util/template-world"

export class FieldsModule extends Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name = 'Fields'
    world: World = CreateWorld(this, startWorld)

    constructor(run?: boolean) {
        // set app
        super(run)

        // you will need to set this when creating the world
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)

        // allow for turn based movement
        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
    }

    addCanvas(elementRef: HTMLElement) {
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    onKeyChange(data: any): void {
        const { isDown } = data
        if (isDown) this.shifting.value = true
    }

    update(delta: number) {
        if (!this.paused.value && this.running.value && this.shifting.value) this.world.update(delta)
    }

}
