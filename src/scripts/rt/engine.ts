import RAPIER from "@dimforge/rapier2d"
import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { Entity } from '../shared/entities/entity'
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { EntityMap } from "./entities/create-entity"
import { RenderSystem } from './systems/render'
import { CreateRoom, RoomMap } from "./util/create-room"
import { Room } from './util/room'
import { SaveManager } from "./util/save-manager"
import { demoRoom, secondRoom, startRoom } from "./util/templates-room"
export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
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

    room!: Room
    roomIndex: number = 0
    rooms: Array<RoomMap>

    player!: Entity

    constructor() {
        // set app
        this.app.stage.eventMode = 'static'

        this.roomIndex = 2
        this.rooms = [demoRoom, secondRoom, startRoom]
        this.switchRoom(this.roomIndex)

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
            this.roomIndex = saveData.room
            this.rooms = []
            this.rooms = saveData.rooms
            this.app.stage.removeChildren()
            this.switchRoom(this.roomIndex)
            this.app.renderer.resize(this.room.roomDimensions.x, this.room.roomDimensions.y)
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
        this.rooms[this.roomIndex] = this.saveManager.createRoomMap(this.room)
        this.saveManager.setData(this.roomIndex, this.rooms)
        this.localStorageManager.saveData(this.saveManager.data)
        this.pause()
    }

    switchEntityToRoom(targetIndex: number, targetEntity: Entity): void {
        const entities = this.rooms[this.roomIndex].entities
        for (let index = 0; index < entities.length; index++) {
            const entity = entities[index]
            if (entity.id === targetEntity.id) {
                entities.splice(index, 1)
                break
            }
        }
        const entityInfo = this.saveManager.createEntityMap(targetEntity)
        this.rooms[targetIndex].entities.push(entityInfo as EntityMap)
    }

    switchRoom(targetIndex: number, targetEntity?: Entity): void {
        this.paused.value = true
        if (this.room && targetEntity) {
            this.room.removeEntity(targetEntity)
        }
        this.app.stage.removeChildren()
        if (targetEntity) {
            this.switchEntityToRoom(targetIndex, targetEntity)
        }
        this.room = CreateRoom(this, this.rooms[targetIndex])
        this.roomIndex = targetIndex
        this.app.renderer.resize(this.room.roomDimensions.x, this.room.roomDimensions.y)
        this.pause()
    }

    update(delta: number) {
        if (!this.paused.value) this.room.update(delta)
    }

}
