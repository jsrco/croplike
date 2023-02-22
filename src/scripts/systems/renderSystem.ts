import { System } from "./index"
import { World } from "../util/World"

export class RenderSystem extends System {
    type: string = 'render'

    constructor(world: World) {
        super(world)
    }
    update(deltaTime: number): void {
        // get etities from world that can be rendered by component, then update them
        // rendering pass into app should be done at component level
    }
}
