import RAPIER from "@dimforge/rapier2d"
import { Base } from "../shared/base"
import { LocalStorageManager } from "../shared/util/local-storage-manager"

export class Engine extends Base {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name: String = 'Fields'

    constructor(run?:boolean) {
        // set app
        super(run)
    }

    addCanvas(elementRef: any ) { // change to HTMLElement when render brought in
        // const render = this.room.getSystemByType('render') as RenderSystem
        // if (render) render.appendElement(elementRef)
        // else console.log("still loading.")
        elementRef.appendChild(this.app.view)
    }

    update(delta: number) {
        // if (!this.paused.value && this.running.value && !this.shifting.value) console.log('render some glyphs')
        if (!this.paused.value && this.running.value && !this.shifting.value) console.log('render some glyphs')
    }

}
