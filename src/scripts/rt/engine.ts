import RAPIER from "@dimforge/rapier2d"
import { Base } from "../shared/base"
import { LocalStorageManager } from "../shared/util/local-storage-manager"
import { EntityMap } from "./entities/create-entity"
import { Entity } from './entities/entity'
import { RenderSystem } from './systems/render'
import { CreateRoom, RoomMap } from "./util/create-room"
import { Room } from './util/room'
import { SaveManager } from "./util/save-manager"
import { demoRoom, secondRoom, startRoom } from "./util/templates-room"

export class Engine extends Base {

    appDimensions: RAPIER.Vector2 = { x: 3000, y: 1500 }
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    name: String = 'Croplike'
    saveManager: SaveManager = new SaveManager()
    
    room!: Room
    roomIndex: number = 0
    rooms: Array<RoomMap>

    player!: Entity

    constructor(run?:boolean) {
        // set app
        super(run)

        this.roomIndex = 2
        this.rooms = [demoRoom, secondRoom, startRoom]
        this.switchRoom(this.roomIndex)

        window.addEventListener('keydown', (event) => {
            if (event.key === 'l') {
                this.load()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 's') {
                this.save()
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
        // if (!this.paused.value && this.running.value) console.log('croplike running')
        if (!this.paused.value && this.running.value) this.room.update(delta)
    }

}
