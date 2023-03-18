import { GraphicsComponent } from "../components"
import { System } from "."
import { World } from "../util/World"

export class RenderSystem extends System {
    constructor(world: World) {
        super(world)

        // add subscriber to adding an entity and dispatch in the world for it
        // the on add can be a private function that adds the entity to the screen if its a renderable
        const entities = this.getEntitiesByComponent('position', 'velocity')
        for (const entity of entities) {
            if (entity.hasComponent("graphics")) {
                const GraphicsComponent = entity.getComponent("graphics") as GraphicsComponent
                GraphicsComponent.addToStage()
            }
        }
    }

    update(deltaTime: number): void {
        // handle any sprites here for future
    }
}

