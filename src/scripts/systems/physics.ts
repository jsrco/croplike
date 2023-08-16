import RAPIER from "@dimforge/rapier2d"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { System } from "./system"
import { World } from "../util/world"

export type Collision = {
  bottom: boolean
  left: boolean
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
        right: false,
        top: false,
      }
      // Check if unit is in contact
      const contacts = []
      this.world.physicsWorld.contactsWith(rapierComponent.collider, (otherCollider) => {
        contacts.push(otherCollider)

        this.world.physicsWorld.contactPair(rapierComponent.collider, otherCollider, (manifold, flipped) => {
          const localNormal = flipped ? manifold.localNormal2() : manifold.localNormal1()

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
            } else if (localNormal.y < 0) {
              CollisionStatus.top = true
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
        rapierComponent.setIsStoodOn(false)
      }
      if (contacts.length > 0) {
        rapierComponent.setIsColliding(true)
        if (CollisionStatus.bottom) rapierComponent.setIsOnGround(true)
        else rapierComponent.setIsOnGround(false)
        if (CollisionStatus.top) rapierComponent.setIsStoodOn(true)
        else rapierComponent.setIsStoodOn(false)
      }
      if (rapierComponent.canGrow) {
        if (colliderInfo.halfExtents.y > 10 && CollisionStatus.top) {
          const newSizeY = colliderInfo.halfExtents.y - 0.2
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
            position.y += 0.1 // Adjust the step size as needed
            rapierComponent.body.setTranslation(position, true)
          }
        }

        if (colliderInfo.halfExtents.y < pixiComponent.maxSize / 2 && !CollisionStatus.top) {
          const newSizeY = colliderInfo.halfExtents.y + 0.2
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
            position.y -= 0.1 // Adjust the step size as needed
            rapierComponent.body.setTranslation(position, true)
          }
        }

        // Make sure to handle other collision status updates here
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