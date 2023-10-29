import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import useEngine from "../../composeables/use-engine"
import { Entity } from "./entities/entity"
import { RenderSystem } from "./systems/render"
import { WorldMap } from "./util/create-world"
import { LocalStorageManager } from "./util/local-storage-manager"
import { SaveManager } from "./util/save-manager"
import { World } from "./util/world"

export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 0, y: 0 }
    app: PIXI.Application
    name!: string
    paused: boolean = false
    running: boolean = false
    shifting: boolean = false
    localStorageManager!: LocalStorageManager<any>
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })

    player!: Entity
    world!: World
    worldIndex: number = 0
    worlds!: Array<WorldMap>

    constructor(run?: boolean) {
        // set app
        this.app = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })

        this.app.stage.eventMode = 'static'

        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p' && this.running === true) {
                useEngine().activeModule.value.pause()
            }
        })

        window.addEventListener('blur', () => {
            if (this.paused === false && this.running === true) useEngine().activeModule.value.pause()
        })

        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                if (this.paused === false && this.running === true) useEngine().activeModule.value.pause()
            }
        })

        if (run) this.startRun()
    }

    addCanvas(elementRef: HTMLElement) {
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    pause(): void {
        this.paused = !this.paused
        if (this.paused) this.pauseTicker()
        else this.resumeTicker()
    }

    pauseTicker(): void {
        this.app.ticker.stop()
        this.app.renderer.clear()
    }

    resumeTicker(): void {
        this.app.ticker.start()
    }

    save(): void {
        this.paused = true
        this.localStorageManager.clearData()
        this.saveManager.clearData()
        this.worlds[this.worldIndex] = this.saveManager.createWorldMap(this.world)
        this.saveManager.setData(this.worldIndex, this.worlds)
        this.localStorageManager.saveData(this.saveManager.data)
        this.pause()
    }

    startRun(): void {
        this.running = true
    }

    stopRun(): void {
        this.running = false
    }

    update(deltaTime: number): void {
        // Override this method in each subclass
    }

}
