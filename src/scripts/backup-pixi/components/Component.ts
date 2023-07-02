import { World } from "../../util/World"
import { Entity } from "../entities/Entity"

interface SaveObject {
    [key: string]: any
}
export class Component {
    owner!: Entity
    type!: string
    world: World

    [key: string]: any // Add index signature
    
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
            if (key !== 'world' && key !== 'owner' && this.type !== 'graphics' && this.type !== 'collision') saveObject[key] = obj[key]
            if (key === 'color' && this.type === 'graphics') saveObject[key] = obj[key]

        }
        return saveObject
    }
}