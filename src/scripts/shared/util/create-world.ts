import RAPIER from "@dimforge/rapier2d"
import { EntityMap } from "../entities/create-entity"


export type WorldMap = {
    entities: Array<EntityMap>
    worldDimensions: RAPIER.Vector2
    systemMap: SystemMap
    options?: any
}

export type SystemMap = {
    movementRT?: boolean,
    movementTB?: boolean,
    physics?: boolean,
    render?: boolean,
}