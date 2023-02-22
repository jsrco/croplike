import { System } from "./index"
import { World } from "../util/World"

export class RenderSystem extends System {
    type: string = 'render'

    constructor(world: World) {
        super(world)
    }
    update(deltaTime: number): void {

    }
}
