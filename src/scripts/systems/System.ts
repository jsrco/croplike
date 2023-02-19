import { Entity } from "../entities/Entity"
import { EventSystem } from "../util/EventSystem"

export interface System {
    update(delta: number, entities: Entity[]): void
    updateWithEvents?(delta: number, entities: Entity[], eventSystem: EventSystem): void
}