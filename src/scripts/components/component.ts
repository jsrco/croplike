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
    copyComponentData(obj: this): SaveObject {
        const saveObject: SaveObject = {}
        for (const key in obj) {
            if (key !== 'world' && key !== 'owner') saveObject[key] = obj[key]
        }
        return saveObject
    }
}