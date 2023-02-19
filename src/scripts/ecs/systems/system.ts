import { Entity } from "../entities/entity"

export interface System {
    components: string[]
    entities: Entity[]

    update(delta: number): void
    addEntity(entity: Entity): void
    removeEntity(entity: Entity): void
}
