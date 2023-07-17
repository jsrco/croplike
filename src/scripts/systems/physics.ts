import RAPIER from "@dimforge/rapier2d"
import { RapierComponent } from "../components/rapier"
import { ThreeComponent } from "../components/three"
import { World } from "../util/World"
import { System } from "./System"

export class PhysicsSystem extends System {


  constructor(world: World) {
    super(world)
  }

  update(deltaTime: number): void {
    this.world.physicsWorld.step(this.world.physicsWorldEventQueue)

    this.world.physicsWorldEventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */
      const collider1 = this.world.physicsWorld.getCollider(handle1)
      const collider2 = this.world.physicsWorld.getCollider(handle2)
      this.world.physicsWorld.contactPair(collider1, collider2, (manifold, flipped) => {
        console.log(manifold)

      })
    })

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