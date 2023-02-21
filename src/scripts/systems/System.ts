import { World } from "../util/World"

export class System {
    world: World

    constructor(world: World) {
        this.world = world
    }

    update(deltaTime: number): void {
        // Override this method in each subclass
    }
}
