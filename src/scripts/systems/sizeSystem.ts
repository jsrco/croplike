import { GravityComponent, SizeChangeComponent, SizeComponent } from "../components"
import { System } from "."
import { World } from "../util/World"

export class SizeSystem extends System {
    constructor(world: World) {
        super(world)
        // add subscriber to adding an entity and dispatch in the world for it
        // the on add can be a function that adds the entity to the screen if its a renderable
    }

    update(deltaTime: number): void {
        // handle any sprites here for future
        const entities = this.getEntitiesByComponent('sizeChange', 'size')
        for (const entity of entities) {
            const sizeChangeComponent = entity.getComponent("sizeChange") as SizeChangeComponent
            const sizeComponent = entity.getComponent("size") as SizeComponent

            if (sizeChangeComponent.isShrinking && sizeComponent.height > 50) {
                sizeComponent.setSize(sizeComponent.width, sizeComponent.height - 1)
            } 
            const gravity = entity.getComponent('gravity') as GravityComponent
            if (gravity.isOnGround && !sizeChangeComponent.isShrinking  && sizeComponent.height < 125) {
                sizeComponent.setSize(sizeComponent.width, sizeComponent.height + 1)
            }

        }
    }
}

