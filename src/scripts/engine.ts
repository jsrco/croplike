import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import useEngine from "../composeables/use-engine"
import { EntityMap } from "./entities/create-entity"
import { Entity } from "./entities/entity"
import { demoWorld, secondWorld, startWorld as startWorldRT } from "./module-data/rt/util/templates-world"
import { startWorld as startWorldTB } from "./module-data/tb/util/template-world"
import { RenderSystem } from "./systems/render"
import { CreateWorld, WorldMap } from "./util/create-world"
import { LocalStorageManager } from "./util/local-storage-manager"
import { SaveManager } from "./util/save-manager"
import { World } from "./util/world"

export class Engine {

    appDimensions: RAPIER.Vector2 = new RAPIER.Vector2(0, 0)
    app: PIXI.Application
    name: string
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

    constructor(name: string, run?: boolean) {
        this.name = name

        if (this.name === 'Croplike') this.localStorageManager = new LocalStorageManager('croplike-v0-game-data')
        if (this.name === 'Fields') this.localStorageManager = new LocalStorageManager('field-v0-game-data')

        // set app
        this.app = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })

        this.app.stage.eventMode = 'static'

        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'l' && this.running === true) {
                useEngine().activeModule.value.load()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p' && this.running === true) {
                useEngine().activeModule.value.pause()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 's' && this.running === true) {
                useEngine().activeModule.value.save()
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

        this.worlds = (this.name === 'Croplike') ? [startWorldRT, demoWorld, secondWorld] : [startWorldTB]

        this.switchWorld(this.worldIndex)

        // allow for turn based movement
        if (this.name === 'Fields') this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))

        if (run) this.startRun()
    }

    addCanvas(elementRef: HTMLElement) {
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    load(): void {
        const saveData: any = this.localStorageManager.getData()
        if (Object.keys(saveData).length !== 0) {
            this.paused = true
            this.worldIndex = saveData.world
            this.worlds = []
            this.worlds = saveData.worlds
            this.app.stage.removeChildren()
            this.switchWorld(this.worldIndex)
            this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)
        } else console.log('no saved data')
    }

    onKeyChange(data: any): void {
        const { isDown } = data
        if (isDown) this.shifting = true
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

    switchEntityToWorld(targetIndex: number, targetEntity: Entity): void {
        const entities = this.worlds[this.worldIndex].entities
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index]
            if (entity.id === targetEntity.id) {
                entities.splice(index, 1)
                break
            }
        }
        const entityInfo = this.saveManager.createEntityMap(targetEntity)
        this.worlds[targetIndex].entities.push(entityInfo as EntityMap)
    }

    switchWorld(targetIndex: number, targetEntity?: Entity): void {
        this.paused = true
        if (this.world && targetEntity) {
            this.world.removeEntity(targetEntity)
        }
        this.app.stage.removeChildren()
        if (targetEntity) {
            this.switchEntityToWorld(targetIndex, targetEntity)
        }
        this.world = CreateWorld(this, this.worlds[targetIndex])
        this.worldIndex = targetIndex
        this.app.renderer.resize(this.world.worldDimensions.x, this.world.worldDimensions.y)
        this.pause()
    }

    update(delta: number): void {
        if (this.name === 'Croplike' && !this.paused && this.running) this.world.update(delta)
        if (this.name === 'Fields' && !this.paused && this.running && this.shifting) this.world.update(delta)
    }

}
