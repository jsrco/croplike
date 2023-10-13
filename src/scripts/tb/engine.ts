import RAPIER from "@dimforge/rapier2d"
import { Base } from "../shared/base"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { RenderSystem } from "./systems/render"
import { World } from "./util/world"

export class Engine extends Base {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name: String = 'Fields'
    world: World = new World(this, { worldDimensions: this.appDimensions} )
    constructor(run?:boolean) {
        // set app
        super(run)
    }

    addCanvas(elementRef: HTMLElement ) { 
        if (this.running.value) this.world.addSystem(new RenderSystem(this.world))
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    update(delta: number) {
        // if (!this.paused.value && this.running.value && !this.shifting.value) console.log('render some glyphs')
        if (!this.paused.value && this.running.value && !this.shifting.value) this.world.update(delta)
    }

}
