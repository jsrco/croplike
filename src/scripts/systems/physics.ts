import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { World } from "../util/World"
import { System } from "./System"

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
        if (rapierComponent1) rapierComponent1.setIsStoodOn(false)
        if (rapierComponent2) rapierComponent2.setIsStoodOn(false)
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
            rapierComponent2.setIsStoodOn(true)
          } else if (bottomCollision2) {
            rapierComponent2.setIsOnGround(true)
            rapierComponent1.setIsStoodOn(true)
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
      })
      if (contacts.length === 0) {
        rapierComponent.setIsColliding(false)
        rapierComponent.setIsOnGround(false)
        rapierComponent.setIsStoodOn(false)
      }
      if (contacts.length > 0) rapierComponent.setIsColliding(true)
      if (contacts.length > 0) {
        if(colliderInfo.halfExtents.y > 10 && rapierComponent.isStoodOn) {
          console.log('should shrink')
          colliderInfo.halfExtents.y -= .5
          rapierComponent.collider.setHalfExtents(colliderInfo.halfExtents)
          const newPixiSize = { x: colliderInfo.halfExtents.x * 2, y: colliderInfo.halfExtents.y * 2}
          pixiComponent.setSize(newPixiSize)
          
          const position = rapierComponent.body.translation()
          position.y += 1
          rapierComponent.body.setTranslation(position,true)
        }
        if(colliderInfo.halfExtents.y < 45 && !rapierComponent.isStoodOn && rapierComponent.canGrow) {
          console.log('should grow')
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