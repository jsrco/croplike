import { CollisionComponent } from "../components/collision"
import { PositionComponent } from "../components/position"
import { System } from "./System"
import { World } from "../util/World"

export class PhysicsSystem extends System {


  constructor(world: World) {
    super(world)
  }

  update(deltaTime: number): void {
    this.world.physicsWorld.step()

    const entities = this.getEntitiesByComponent('collision', 'position')
    for (const entity of entities) {
      const collisionComponent = entity.getComponent('collision') as CollisionComponent
      const positionComponent = entity.getComponent('position') as PositionComponent
      // Update position based on body translation
      const position = collisionComponent.body.translation()
      positionComponent.setPosition(
        position.x, // * deltaTime,
        position.y, // * deltaTime, 
      )
    }
  }

}