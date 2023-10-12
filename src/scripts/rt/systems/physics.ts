import RAPIER from "@dimforge/rapier2d"
import { System } from "../../shared/systems/system"
import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { Room } from "../util/room"

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

  constructor(room: Room) {
    super(room)
  }

  adjustPosition(colliderInfo: RAPIER.Cuboid, pixiComponent: PixiComponent, rapierComponent: RapierComponent) {
    const position = rapierComponent.body.translation()
    // Pixi renders the sprites starting from the center of the collider
    position.x -= colliderInfo.halfExtents.x
    position.y -= colliderInfo.halfExtents.y
    pixiComponent.setPosition(position)
  }

  entityGrowth(colliderInfo: RAPIER.Cuboid, pixiComponent: PixiComponent, rapierComponent: RapierComponent, collisionStatus: Collision): void {
    const halfExtentsGrowth = 0.2
    const positionAdjust = 0.2
    if (colliderInfo.halfExtents.y > 10 && collisionStatus.top) {
      const newSizeY = colliderInfo.halfExtents.y - halfExtentsGrowth
      if (newSizeY >= 10) {
        // Reduce size and update physics properties gradually
        const newSize = { ...colliderInfo.halfExtents }
        newSize.y = newSizeY
        colliderInfo.halfExtents = newSize
        rapierComponent.collider.setHalfExtents(newSize)
        const newPixiSize = { x: newSize.x * 2, y: newSize.y * 2 }
        pixiComponent.setSize(newPixiSize)

        // Gradually update rider position
        if (collisionStatus.rider) {
          const riderPosition = collisionStatus.rider.body.translation()
          riderPosition.y += positionAdjust // Adjust the step size as needed
          collisionStatus.rider.body.setTranslation(riderPosition, true)
        }

        // Gradually update position
        const position = rapierComponent.body.translation()
        position.y += positionAdjust // Adjust the step size as needed
        rapierComponent.body.setTranslation(position, true)
      }
    }

    if (colliderInfo.halfExtents.y < pixiComponent.maxSize / 2 && !collisionStatus.top) {
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

  gatherContactsInfo(contacts: Array<RAPIER.Collider | undefined>, rapierComponent: RapierComponent, collisionStatus: Collision): void {
    this.room.physicsWorld.contactsWith(rapierComponent.collider, (otherCollider) => {
      contacts.push(otherCollider)

      this.room.physicsWorld.contactPair(rapierComponent.collider, otherCollider, (manifold, flipped) => {
        const localNormal = flipped ? manifold.localNormal2() : manifold.localNormal1()
        const otherEntity = this.room.getEntityByHandle(otherCollider.handle)
        const otherRaiperComponent = otherEntity?.getComponent('rapier') as RapierComponent

        // Define the room up vector for a 2D game
        const upVector = { x: 0, y: 1 }

        // Calculate the cross product (z component) between the contact normal and the room up vector
        const crossProductZ = localNormal.x * upVector.y - localNormal.y * upVector.x

        // Define thresholds for identifying collision sides
        const verticalThreshold = 0.8 // Adjust as needed
        const horizontalThreshold = 0.8 // Adjust as needed

        // Determine which side of the collider the collision occurred on
        if (Math.abs(crossProductZ) < verticalThreshold) {
          // Vertical collision
          if (localNormal.y > 0) {
            collisionStatus.bottom = true
            if (otherEntity?.name !== 'wall') {
              collisionStatus.riding = true
              rapierComponent.setIsRiding(true)
            }
          } else if (localNormal.y < 0) {
            collisionStatus.top = true
            collisionStatus.rider = otherRaiperComponent
          }
        } else if (Math.abs(crossProductZ) < horizontalThreshold) {
          // Horizontal collision
          if (localNormal.x > 0) {
            collisionStatus.right = true
          } else if (localNormal.x < 0) {
            collisionStatus.left = true
          }
        }
      })
    })
  }

  handleCollisions(contacts: Array<RAPIER.Collider | undefined>, rapierComponent: RapierComponent, collisionStatus: Collision): void {
    if (contacts.length === 0) {
      rapierComponent.setIsColliding(false)
      rapierComponent.setIsOnGround(false)
      rapierComponent.setIsRiding(false)
      rapierComponent.setIsStoodOn(false)
    }
    if (contacts.length > 0) {
      rapierComponent.setIsColliding(true)
      if (collisionStatus.bottom) {
        rapierComponent.setIsOnGround(true)
      } else {
        rapierComponent.setIsOnGround(false)
      }
      if (collisionStatus.riding) rapierComponent.setIsRiding(true)
      else rapierComponent.setIsRiding(false)
      if (collisionStatus.top) rapierComponent.setIsStoodOn(true)
      else rapierComponent.setIsStoodOn(false)
    }
  }

  triggerShowColliderBounds(): void { this.showColliderBounds = !this.showColliderBounds }

  update(deltaTime: number): void {
    this.room.physicsWorld.step(this.room.physicsWorldEventQueue)

    const entities = this.getEntitiesByComponent('rapier', 'pixi')
    for (const entity of entities) {
      const pixiComponent = entity.getComponent('pixi') as PixiComponent
      const rapierComponent = entity.getComponent('rapier') as RapierComponent
      const colliderInfo = rapierComponent.collider.shape as RAPIER.Cuboid
      const collisionStatus: Collision = {
        bottom: false,
        left: false,
        rider: undefined,
        riding: false,
        right: false,
        top: false,
      }
      const contacts: Array<RAPIER.Collider | undefined> = []

      this.gatherContactsInfo(contacts, rapierComponent, collisionStatus)

      this.handleCollisions(contacts, rapierComponent, collisionStatus)

      if (rapierComponent.canGrow) this.entityGrowth(colliderInfo, pixiComponent, rapierComponent, collisionStatus)

      this.adjustPosition(colliderInfo, pixiComponent, rapierComponent)

      if (this.showColliderBounds) rapierComponent.updateGraphics()
      else if (!rapierComponent.cleared) rapierComponent.clearColliderGraphics()
    }
  }

}