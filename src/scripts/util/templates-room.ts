import { bigDemoEntity, demoEntity, growthDemoEntity, player } from "../entities/templates-entity"
import { RoomMap } from "./create-room"

export const demoRoom: RoomMap = {
        entities: [ bigDemoEntity, demoEntity, growthDemoEntity, player],
        systemMap: {
            movement: true,
            physics: true,
            render: true, 
        }
}

