import { Entity } from "../entities/entity"
import { World } from "../util/world"

interface SaveObject {
    [key: string]: any
}

export class Component {

    [key: string]: any // Add index signature
    owner!: Entity
    type!: string
    world: World

    constructor(entity: Entity, world: World) {
        this.owner = entity
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
            if (key !== 'body' && key !== 'cleared' && key !== 'collider' && key !== 'colliderGraphics' && key !== 'owner' && key !== 'sprite' && key !== 'type' && key !== 'world') saveObject[key] = obj[key]
        }
        return saveObject
    }

}
