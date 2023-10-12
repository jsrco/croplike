import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { LocalStorageManager } from "../shared/util/local-storage-manager"

export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })
    localStorageManager = new LocalStorageManager('field-v0-game-data')
    name: String = 'Fields'
    paused: Ref<Boolean> = ref(false)
    shifting: Ref<Boolean> = ref(false)
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })

    constructor() {
        // set app
        this.app.stage.eventMode = 'static'
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause()
            }
        })

        window.addEventListener('blur', () => {
            if (this.paused.value === false) this.pause()
        })

        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                if (this.paused.value === false) this.pause()
            }
        })
    }

    addCanvas(elementRef: any ) { // change to HTMLElement when render brought in
        // const render = this.room.getSystemByType('render') as RenderSystem
        // if (render) render.appendElement(elementRef)
        // else console.log("still loading.")
        elementRef.appendChild(this.app.view)

    }

    pause(): void {
        this.paused.value = !this.paused.value
        if (this.paused.value) this.pauseTicker()
        else this.resumeTicker()
    }

    pauseTicker(): void {
        this.app.ticker.stop()
        this.app.renderer.clear()
    }

    resumeTicker(): void {
        this.app.ticker.start()
    }

    update(delta: number) {
        if (!this.paused.value && !this.shifting.value) console.log('render some stuff')
    }

}
