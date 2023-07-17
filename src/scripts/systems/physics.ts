import { RapierComponent } from "../components/rapier"
import { ThreeComponent } from "../components/three"
import { World } from "../util/World"
import { System } from "./System"

export class PhysicsSystem extends System {


  constructor(world: World) {
    super(world)
  }

  update(deltaTime: number): void {
    this.world.physicsWorld.step()

    const entities = this.getEntitiesByComponent('rapier', 'three')
    for (const entity of entities) {
      const rapierComponent = entity.getComponent('rapier') as RapierComponent
      const threeComponent = entity.getComponent('three') as ThreeComponent
      // Update position based on body translation
      const position = rapierComponent.body.translation()
      threeComponent.setPosition(position)
    }
  }

}