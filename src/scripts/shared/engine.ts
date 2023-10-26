import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { Entity } from "./entities/entity"
import { SaveManager } from "./util/save-manager"

export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 0, y: 0 }
    app: PIXI.Application
    name!: string
    paused: Ref<boolean> = ref(false)
    running: Ref<boolean> = ref(false)
    shifting: Ref<boolean> = ref(false)
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })

    player!: Entity

    constructor(run?: boolean) {
        // set app
        this.app = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })

        this.app.stage.eventMode = 'static'

        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p' && this.running.value === true) {
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

        if (run) this.startRun()
    }

    addCanvas(elementRef: HTMLElement) {
        // Override this method in each subclass
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

    startRun(): void {
        this.running.value = true
    }

    stopRun(): void {
        this.running.value = false
    }

    update(deltaTime: number): void {
        // Override this method in each subclass
    }

}
