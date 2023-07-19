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
        const entity1 = this.world.getEntityByHandle(handle1)
        const entity2 = this.world.getEntityByHandle(handle2)

        if (entity1 && entity2) {
          const normal1 = manifold.localNormal1()
          const normal2 = manifold.localNormal2()

          // Check if collision occurred on the bottom of either entity
          const bottomCollision1 = normal1.y < 0 || normal1.y < normal2.y
          const bottomCollision2 = normal2.y < 0 || normal2.y < normal1.y

          if (bottomCollision1) {
            const rapierComponent = entity1.getComponent('rapier') as RapierComponent
            rapierComponent.setIsOnGround(true)
          } else if (bottomCollision2) {
            const rapierComponent = entity2.getComponent('rapier') as RapierComponent
            rapierComponent.setIsOnGround(true)
          }
        }
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