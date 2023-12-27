import { WorldMap } from "../../../util/create-world"
import { dummy, player, pushMe, stalker } from "../entities/templates-entity"


export const startWorld: WorldMap = {
    entities: [dummy, player, pushMe, stalker],
    worldDimensions: { x: 700, y: 500 },
    systemMap: {
        movementTB: true,
        render: true,
    }
}