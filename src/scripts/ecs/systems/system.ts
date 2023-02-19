import { Entity } from "../entities/entity"
import { EventSystem } from "../util/events-system"

export interface System {
    update(delta: number, entities: Entity[]): void
    updateWithEvents?(delta: number, entities: Entity[], eventSystem: EventSystem): void
}