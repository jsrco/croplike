import { Entity } from "../entities/Entity"
import { World } from "../util/World"

interface SaveObject {
    [key: string]: any
}
export class Component {
    owner!: Entity
    type!: string
    world: World

    constructor(world: World) {
        this.world = world
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
            if (key !== 'world' && key !== 'owner' && this.type !== 'graphics') saveObject[key] = obj[key]
        }
        return saveObject
    }
}