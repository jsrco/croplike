import { Entity } from "../entities/Entity"
import { World } from "../util/World"

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
            if (key === 'bodyType' || key === 'color' || key === 'dominance' || key === 'isColliding' || key === 'isOnGround' || key === 'position' || key === 'size' || key === 'velocity') saveObject[key] = obj[key]
        }
        return saveObject
    }

}