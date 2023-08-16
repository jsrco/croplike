import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { System } from "./system"
import { World } from "../util/world"

export class PhysicsSystem extends System {

  showColliderBounds: boolean = true
  type: string = 'physics'

  constructor(world: World) {
    super(world)
  }

  triggerShowColliderBounds(): void { this.showColliderBounds = !this.showColliderBounds }

  update(deltaTime: number): void {
    this.world.physicsWorld.step(this.world.physicsWorldEventQueue)
    this.world.physicsWorldEventQueue.drainCollisionEvents((handle1, handle2, started) => {
      /* Handle the collision event. */
      const entity1 = this.world.getEntityByHandle(handle1)
      const entity2 = this.world.getEntityByHandle(handle2)
      
      if (!started) {
        const rapierComponent1 = entity1?.getComponent('rapier') as RapierComponent
        const rapierComponent2 = entity2?.getComponent('rapier') as RapierComponent
        if (rapierComponent1) rapierComponent1.setIsColliding(false)
        if (rapierComponent2) rapierComponent2.setIsColliding(false)
      }

      this.world.physicsWorld.narrowPhase.contactPair(handle1, handle2, (manifold, flipped) => {
        // Contact information can be read from `manifold`.
        if (entity1 && entity2) {
          const normal1 = manifold.localNormal1()
          const normal2 = manifold.localNormal2()
          // Check if collision occurred on the bottom of either entity
          const bottomCollision1 = normal1.y > 0 || normal1.y > normal2.y
          const bottomCollision2 = normal2.y > 0 || normal2.y > normal1.y
          const rapierComponent1 = entity1.getComponent('rapier') as RapierComponent
          const rapierComponent2 = entity2.getComponent('rapier') as RapierComponent
          if (bottomCollision1) {
            rapierComponent1.setIsOnGround(true)
            if (entity2.name !== 'wall') rapierComponent1.setVelocity({ x: rapierComponent2.velocity.x === 0 ? rapierComponent1.velocity.x : rapierComponent2.velocity.x, y: rapierComponent1.velocity.y,})
            rapierComponent2.setIsStoodOn(true)
          } else if (bottomCollision2) {
            rapierComponent2.setIsOnGround(true)
            if (entity1.name !== 'wall') rapierComponent2.setVelocity({ x: rapierComponent1.velocity.x === 0 ? rapierComponent2.velocity.x : rapierComponent1.velocity.x, y: rapierComponent2.velocity.y,})
            rapierComponent1.setIsStoodOn(true)
          } else if (!bottomCollision1 && !bottomCollision2) {
            rapierComponent1.setIsOnGround(false)
            rapierComponent1.setIsStoodOn(false)
            rapierComponent2.setIsOnGround(false)
            rapierComponent2.setIsStoodOn(false)
          }
        }
      })
    })

    const entities = this.getEntitiesByComponent('rapier', 'pixi')
    for (const entity of entities) {
      const pixiComponent = entity.getComponent('pixi') as PixiComponent
      const rapierComponent = entity.getComponent('rapier') as RapierComponent
      const colliderInfo = rapierComponent.collider.shape as RAPIER.Cuboid
      
      // Check if unit is in contact
      const contacts = []
      this.world.physicsWorld.contactsWith(rapierComponent.collider, (otherCollider) => {
        contacts.push(otherCollider)

        // this.world.physicsWorld.contactPair(rapierComponent.collider, otherCollider,  (manifold, flipped) => {
        //   console.log('detect collision type and then correct status', manifold.localNormal1())
        // })
      })
      if (contacts.length === 0) {
        rapierComponent.setIsColliding(false)
        rapierComponent.setIsOnGround(false)
        rapierComponent.setIsStoodOn(false)
      }
      if (contacts.length > 0) rapierComponent.setIsColliding(true)
      if (contacts.length > 0 && rapierComponent.canGrow) {
        if(colliderInfo.halfExtents.y > 10 && rapierComponent.isStoodOn) {
          colliderInfo.halfExtents.y -= .5
          rapierComponent.collider.setHalfExtents(colliderInfo.halfExtents)
          const newPixiSize = { x: colliderInfo.halfExtents.x * 2, y: colliderInfo.halfExtents.y * 2}
          pixiComponent.setSize(newPixiSize)
          const position = rapierComponent.body.translation()
          position.y += 1
          rapierComponent.body.setTranslation(position,true)
        }

        if(colliderInfo.halfExtents.y < pixiComponent.maxSize / 2 && !rapierComponent.isStoodOn && rapierComponent.canGrow) {
          colliderInfo.halfExtents.y += .5
          rapierComponent.collider.setHalfExtents(colliderInfo.halfExtents)
          const newPixiSize = { x: colliderInfo.halfExtents.x * 2, y: colliderInfo.halfExtents.y * 2}
          pixiComponent.setSize(newPixiSize)
          const position = rapierComponent.body.translation()
          position.y -= 1
          rapierComponent.body.setTranslation(position,true)
        }
      }

      if (this.showColliderBounds) rapierComponent.updateGraphics()
      else if (!rapierComponent.cleared) rapierComponent.clearColliderGraphics()
      const position = rapierComponent.body.translation()
      // Pixi renders the sprites starting from the center of the collider
      position.x -= colliderInfo.halfExtents.x 
      position.y -= colliderInfo.halfExtents.y
      pixiComponent.setPosition(position)
    }
  }

}