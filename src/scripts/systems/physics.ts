import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { System } from "./system"
import { World } from "../util/world"

export type Collision = {
  bottom: boolean
  left: boolean
  rider?: RapierComponent
  riding: boolean
  right: boolean
  top: boolean
}
export class PhysicsSystem extends System {

  showColliderBounds: boolean = true
  type: string = 'physics'

  constructor(world: World) {
    super(world)
  }

  triggerShowColliderBounds(): void { this.showColliderBounds = !this.showColliderBounds }

  update(deltaTime: number): void {
    this.world.physicsWorld.step(this.world.physicsWorldEventQueue)

    const entities = this.getEntitiesByComponent('rapier', 'pixi')
    for (const entity of entities) {
      const pixiComponent = entity.getComponent('pixi') as PixiComponent
      const rapierComponent = entity.getComponent('rapier') as RapierComponent
      const colliderInfo = rapierComponent.collider.shape as RAPIER.Cuboid
      const CollisionStatus: Collision = {
        bottom: false,
        left: false,
        rider: undefined,
        riding: false,
        right: false,
        top: false,
      }
      // Check if unit is in contact
      const contacts = []
      this.world.physicsWorld.contactsWith(rapierComponent.collider, (otherCollider) => {
        contacts.push(otherCollider)

        this.world.physicsWorld.contactPair(rapierComponent.collider, otherCollider, (manifold, flipped) => {
          const localNormal = flipped ? manifold.localNormal2() : manifold.localNormal1()
          const otherEntity = this.world.getEntityByHandle(otherCollider.handle)
          const otherRaiperComponent = otherEntity?.getComponent('rapier') as RapierComponent

          // Define the world up vector for a 2D game
          const upVector = { x: 0, y: 1 }

          // Calculate the cross product (z component) between the contact normal and the world up vector
          const crossProductZ = localNormal.x * upVector.y - localNormal.y * upVector.x

          // Define thresholds for identifying collision sides
          const verticalThreshold = 0.8 // Adjust as needed
          const horizontalThreshold = 0.8 // Adjust as needed

          // Determine which side of the collider the collision occurred on
          if (Math.abs(crossProductZ) < verticalThreshold) {
            // Vertical collision
            if (localNormal.y > 0) {
              CollisionStatus.bottom = true
              if (otherEntity?.name !== 'wall') {
                CollisionStatus.riding = true
                rapierComponent.setIsRiding(true)
                const offset = 0.4
                rapierComponent.setVelocity({ x: otherRaiperComponent.velocity.x , y: rapierComponent.velocity.y })
              }
            } else if (localNormal.y < 0) {
              CollisionStatus.top = true
              CollisionStatus.rider = otherRaiperComponent
            }
          } else if (Math.abs(crossProductZ) < horizontalThreshold) {
            // Horizontal collision
            if (localNormal.x > 0) {
              CollisionStatus.right = true
            } else if (localNormal.x < 0) {
              CollisionStatus.left = true
            }
          }
        })
      })
      if (contacts.length === 0) {
        rapierComponent.setIsColliding(false)
        rapierComponent.setIsOnGround(false)
        rapierComponent.setIsRiding(false)
        rapierComponent.setIsStoodOn(false)
      }
      if (contacts.length > 0) {
        rapierComponent.setIsColliding(true)
        if (CollisionStatus.bottom) {
          rapierComponent.setIsOnGround(true)
        } else {
          rapierComponent.setIsOnGround(false)
        }
        if (CollisionStatus.riding) rapierComponent.setIsRiding(true)
        else rapierComponent.setIsRiding(false)
        if (CollisionStatus.top) rapierComponent.setIsStoodOn(true)
        else rapierComponent.setIsStoodOn(false)
      }
      if (rapierComponent.canGrow) {
        const halfExtentsGrowth = 0.2
        const positionAdjust = 0.1
        if (colliderInfo.halfExtents.y > 10 && CollisionStatus.top) {
          const newSizeY = colliderInfo.halfExtents.y - halfExtentsGrowth
          if (newSizeY >= 10) {
            // Reduce size and update physics properties gradually
            const newSize = { ...colliderInfo.halfExtents }
            newSize.y = newSizeY
            colliderInfo.halfExtents = newSize
            rapierComponent.collider.setHalfExtents(newSize)
            const newPixiSize = { x: newSize.x * 2, y: newSize.y * 2 }
            pixiComponent.setSize(newPixiSize)

            // Gradually update position
            const position = rapierComponent.body.translation()
            position.y += positionAdjust // Adjust the step size as needed
            rapierComponent.body.setTranslation(position, true)
            // Gradually update rider position
            if (CollisionStatus.rider) {
              const riderPosition = CollisionStatus.rider.body.translation()
              riderPosition.y += positionAdjust // Adjust the step size as needed
              CollisionStatus.rider.body.setTranslation(riderPosition, true)

            }
          }
        }

        if (colliderInfo.halfExtents.y < pixiComponent.maxSize / 2 && !CollisionStatus.top) {
          const newSizeY = colliderInfo.halfExtents.y + halfExtentsGrowth
          if (newSizeY <= pixiComponent.maxSize / 2) {
            // Increase size and update physics properties gradually
            const newSize = { ...colliderInfo.halfExtents }
            newSize.y = newSizeY
            colliderInfo.halfExtents = newSize
            rapierComponent.collider.setHalfExtents(newSize)
            const newPixiSize = { x: newSize.x * 2, y: newSize.y * 2 }
            pixiComponent.setSize(newPixiSize)

            // Gradually update position
            const position = rapierComponent.body.translation()
            position.y -= positionAdjust // Adjust the step size as needed
            rapierComponent.body.setTranslation(position, true)
          }
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