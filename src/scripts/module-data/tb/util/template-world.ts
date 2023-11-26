import { WorldMap } from "../../../util/create-world"
import { dummy, player, pushMe } from "../entities/templates-entity"


export const startWorld: WorldMap = {
    entities: [dummy, player, pushMe],
    worldDimensions: { x: 700, y: 500 },
    systemMap: {
        movementTB: true,
        render: true,
    }
}