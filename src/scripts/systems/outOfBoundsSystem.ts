import { PositionComponent } from "../components"
import { System } from "."
import { World } from "../util/World"

export class OutOfBoundsSystem extends System {
    constructor(world: World) {
        super(world)
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('position')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            if (positionComponent.x < 0 || positionComponent.x > this.world.app.renderer.width || positionComponent.y <  0 || positionComponent.y > this.world.app.renderer.height) {
                positionComponent.setPosition(30,30)
            } 
        }
    }
}
