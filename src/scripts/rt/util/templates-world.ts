import { bigDemoEntity, demoEntity, growthDemoEntity, player } from "../entities/templates-entity"
import { WorldMap } from "./create-world"

export const demoWorld: WorldMap = {
        entities: [ bigDemoEntity, demoEntity, growthDemoEntity],
        worldDimensions:  { x: 1800, y: 1500 },
        systemMap: {
            movement: true,
            physics: true,
            render: true, 
        }
}

export const secondWorld: WorldMap = {
    entities: [ bigDemoEntity, demoEntity, growthDemoEntity ],
    worldDimensions:  { x: 1200, y: 1500 },
    systemMap: {
        movement: true,
        physics: true,
        render: true, 
    }
}

export const startWorld: WorldMap = {
    entities: [ player ],
    worldDimensions:  { x: 1800, y: 1500 },
    systemMap: {
        movement: true,
        physics: true,
        render: true, 
    }
}