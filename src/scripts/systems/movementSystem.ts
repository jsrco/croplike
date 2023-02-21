import { PositionComponent, VelocityComponent } from "../components"
import { System } from "./System"

export class MovementSystem extends System {
  update(deltaTime: number): void {
    const entities = this.world.getEntitiesByComponent('graphics', 'position', 'velocity')
    for (const entity of entities) {
        //handle entity movement
    }
  }
}