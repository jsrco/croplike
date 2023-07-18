import { RapierComponent } from "../components/rapier"
import { ThreeComponent } from "../components/three"
import { System } from "./System"
import { World } from "../util/World"

export class PhysicsSystem extends System {

  constructor(world: World) {
    super(world)
  }

  update(deltaTime: number): void {
    this.world.physicsWorld.step(this.world.physicsWorldEventQueue)

    this.world.physicsWorldEventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */
      this.world.physicsWorld.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
        // Contact information can be read from `manifold`. 
        console.log(this.world.getEntityByHandle(handle1)?.name + ' normal', manifold.localNormal1())
        console.log(this.world.getEntityByHandle(handle2)?.name + ' normal', manifold.localNormal2())
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