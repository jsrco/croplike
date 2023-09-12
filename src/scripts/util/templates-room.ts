import { bigDemoEntity, demoEntity, growthDemoEntity, player } from "../entities/templates-entity"
import { RoomMap } from "./create-room"

export const demoRoom: RoomMap = {
        entities: [ bigDemoEntity, demoEntity, growthDemoEntity],
        roomDimensions:  { x: 1800, y: 1500 },
        systemMap: {
            movement: true,
            physics: true,
            render: true, 
        }
}

export const secondRoom: RoomMap = {
    entities: [ bigDemoEntity, demoEntity, growthDemoEntity ],
    roomDimensions:  { x: 1200, y: 1500 },
    systemMap: {
        movement: true,
        physics: true,
        render: true, 
    }
}

export const startRoom: RoomMap = {
    entities: [ player ],
    roomDimensions:  { x: 1800, y: 1500 },
    systemMap: {
        movement: true,
        physics: true,
        render: true, 
    }
}