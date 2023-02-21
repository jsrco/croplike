import { Entity } from "../entities/Entity"
import { EventManager } from "../util/EventManager"

export class Component {
    eventManager: EventManager
    owner!: Entity
    type!: string
    constructor(   eventManager: EventManager) {
        this.eventManager = eventManager
     }
}