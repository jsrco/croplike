import { World } from "../util/World"

export class System {
    type!: string
    world: World

    constructor(world: World) {
        this.world = world
    }

    update(deltaTime: number): void {
        // Override this method in each subclass
    }
}
