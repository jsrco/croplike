import { Entity } from "../entities/entity"
import { Room } from "../util/room"

interface SaveObject {
    [key: string]: any
}

export class Component {

    [key: string]: any // Add index signature
    owner!: Entity
    type!: string
    room: Room

    constructor(entity: Entity, room: Room) {
        this.owner = entity
        this.room = room
    }

    applyComponentData(data: SaveObject): void {
        for (const key in data) {
            if (this.hasOwnProperty(key)) {
                this[key] = data[key]
            }
        }
    }

    copyComponentData(obj: this): SaveObject {
        const saveObject: SaveObject = {}
        for (const key in obj) {
            if (key !== 'body' && key !== 'cleared' && key !== 'collider' && key !== 'colliderGraphics' && key !== 'owner'  && key !== 'sprite' && key !== 'type' && key !== 'room') saveObject[key] = obj[key]
        }
        return saveObject
    }

}
