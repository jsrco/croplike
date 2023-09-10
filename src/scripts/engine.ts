import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { CreateEntity, EntityMap } from './entities/create-entity'
import { Entity } from './entities/entity'
import { player } from './entities/templates-entity'
import { RenderSystem } from './systems/render'
import { createRoom } from "./util/create-room"
import { demoRoom } from "./util/templates-room"
import { LocalStorageManager } from "./util/local-storage-manager"
import { Room } from './util/room'
import { SaveManager } from "./util/save-manager"
export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 1800, y: 1500 }
    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    name: String = 'Croplike'
    paused: Ref<Boolean> = ref(false)
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })
    room: Room = createRoom(this, demoRoom)

    player!: Entity

    constructor() {
        // set app
        this.app.stage.eventMode = 'static'
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'l') {
                this.load()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 's') {
                this.save()
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

    addCanvas(elementRef: HTMLElement) {
        const render = this.room.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    load(): void {
        const saveData: any = this.localStorageManager.getData()
        if (Object.keys(saveData).length !== 0) {
            this.paused.value = true
            this.app.stage.removeChildren()
            this.room = new Room(this)
            this.createBounds(this.room)
            saveData.entities.forEach((entity: EntityMap) => {
                this.saveManager.loadEntity(entity, this.room)
            })
            this.loadSystems(this.room)
            this.pause()
        } else console.log('no saved data')
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

    save(): void {
        this.paused.value = true
        this.localStorageManager.clearData()
        this.saveManager.clearData()
        this.saveManager.createAllEntityData(this.room)
        this.localStorageManager.saveData(this.saveManager.data)
        this.pause()
    }

    update(delta: number) {
        if (!this.paused.value) this.room.update(delta)
    }

}
