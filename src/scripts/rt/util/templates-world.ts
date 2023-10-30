import { WorldMap } from "../../util/create-world"
import { bigDemoEntity, demoEntity, growthDemoEntity, player } from "../entities/templates-entity"

export const demoWorld: WorldMap = {
    entities: [bigDemoEntity, demoEntity, growthDemoEntity],
    worldDimensions: { x: 1800, y: 1500 },
    systemMap: {
        movementRT: true,
        physics: true,
        render: true,
    }
}

export const secondWorld: WorldMap = {
    entities: [bigDemoEntity, demoEntity, growthDemoEntity],
    worldDimensions: { x: 1200, y: 1500 },
    systemMap: {
        movementRT: true,
        physics: true,
        render: true,
    }
}

export const startWorld: WorldMap = {
    entities: [player, demoEntity],
    worldDimensions: { x: 1800, y: 1500 },
    systemMap: {
        movementRT: true,
        physics: true,
        render: true,
    }
}