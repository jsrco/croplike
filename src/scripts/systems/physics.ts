import { System } from "./System"
import { World } from "../util/World"

export class PhysicsSystem extends System {


  constructor(world: World) {
    super(world)
  }

  update(deltaTime: number): void {
    this.world.physicsWorld.step()
  }

}
