import { System } from "."
import { World } from "../../util/World"
import { Engine } from "../Engine"
import { CollisionComponent, GravityComponent, JumpComponent, PositionComponent, SizeChangeComponent, SizeComponent, VelocityComponent, WallCollisionComponent, WallComponent } from "../components"
import { Entity } from "../entities/Entity"

export class CollisionSystem extends System {
  source: Engine
  constructor(world: World, source: Engine) {
    super(world)
    this.source = source
  }

  update(deltaTime: number): void {
    const entities = this.getEntitiesByComponent('collision', 'position')
    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i]
      let collision = 0
      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j]
        const check = this.checkCollision(entityA, entityB)
        if (check[0]) {
          collision += 1
          this.handleCollision(entityA, entityB, check)
          const sizeChangeComponent = entityB.getComponent("sizeChange") as SizeChangeComponent
          if (sizeChangeComponent) {
            if (check[1] === 'bottom') {
              if (sizeChangeComponent) sizeChangeComponent.setIsShrinking(true)
            } else if (check[1] === 'top') {
              if (sizeChangeComponent) sizeChangeComponent.setIsShrinking(false)
              const gravity = entityA.getComponent('gravity') as GravityComponent
              if (gravity) gravity.setGroundStatus(false)
            }
          }
        }
      }
      if (collision === 0) {
        const gravity = entityA.getComponent('gravity') as GravityComponent
        if (gravity) gravity.setGroundStatus(false)
        if (gravity) gravity.setRidingStatus(false)
        const wallCollisionComponent = entityA.getComponent('wallCollision') as WallCollisionComponent
        if (wallCollisionComponent) wallCollisionComponent.setIsSliding(false, '')
        const sizeChangeComponent = entityA.getComponent("sizeChange") as SizeChangeComponent
        if (sizeChangeComponent) sizeChangeComponent.setIsShrinking(false)
      }
    }
  }
  checkCollision(entityA: Entity, entityB: Entity): [boolean, string, string] {
    const collisionA = entityA.getComponent('collision') as CollisionComponent
    const collisionB = entityB.getComponent('collision') as CollisionComponent
    const itDidHappen = collisionA.rectangle.intersects(collisionB.rectangle)
    if (itDidHappen) {
      let collisionSide: string = ''
      let oppositeSide: string = ''
      const positionA = entityA.getComponent('position') as PositionComponent
      const positionB = entityB.getComponent('position') as PositionComponent
      const sizeA = entityA.getComponent('size') as SizeComponent
      const sizeB = entityB.getComponent('size') as SizeComponent
      // Determine direction of collision
      const deltaX = (positionA.x + sizeA.width / 2) - (positionB.x + sizeB.width / 2)
      const deltaY = (positionA.y + sizeA.height / 2) - (positionB.y + sizeB.height / 2)
      const intersectX = Math.abs(deltaX) - (sizeA.width / 2 + sizeB.width / 2)
      const intersectY = Math.abs(deltaY) - (sizeA.height / 2 + sizeB.height / 2)
      if (intersectX > intersectY) {
        collisionSide = deltaX > 0 ? 'left' : 'right'
        oppositeSide = deltaX > 0 ? 'right' : 'left'
      } else {
        collisionSide = deltaY > 0 ? 'top' : 'bottom'
        oppositeSide = deltaY > 0 ? 'bottom' : 'top'
      }
      return [itDidHappen, collisionSide, oppositeSide]
    } else return [itDidHappen, '', '']
  }
  correctCollision(entityA: Entity, entityB: Entity, whereItHappened: string): void {
    const positionA = entityA.getComponent('position') as PositionComponent
    const positionB = entityB.getComponent('position') as PositionComponent
    const sizeA = entityA.getComponent('size') as SizeComponent
    const sizeB = entityB.getComponent('size') as SizeComponent
    switch (whereItHappened) {
      case 'left':
        positionA.setPosition(positionB.x + sizeB.width, positionA.y)
        break
      case 'right':
        positionA.setPosition(positionB.x - sizeA.width, positionA.y)
        break
      case 'top':
        positionA.setPosition(positionA.x, positionB.y + sizeB.height)
        break
      case 'bottom':
        positionA.setPosition(positionA.x, positionB.y - sizeA.height)
        break
    }
  }
  handleCollision(entityA: Entity, entityB: Entity, check: [boolean, string, string]): void {
    this.correctCollision(entityA, entityB, check[1])
    const velocityA = entityA.getComponent('velocity') as VelocityComponent
    const velocityB = entityB.getComponent('velocity') as VelocityComponent
    if (check[1] === 'left' || check[1] === 'right') {
      if (entityA.name === 'player') {
        const wallCollisionComponent = entityA.getComponent('wallCollision') as WallCollisionComponent
        wallCollisionComponent.setIsSliding(true, check[1])
        const jumping = entityA.getComponent('jump') as JumpComponent
        if (jumping) jumping.setIsJumping(false)
      }
      if (entityA.name !== 'largeEntity' && velocityA) velocityA.setVelocity(velocityB ? velocityB.x : 0, velocityA.y)
      if (entityB.name !== 'largeEntity' && velocityB) velocityB.setVelocity(velocityA ? velocityA.x : 0, velocityB.y)
    } else if (check[1] === 'top' || check[1] === 'bottom') {
      const isWall = entityB.getComponent('wall') as WallComponent
      if (check[1] === 'bottom') {
        const gravity = entityA.getComponent('gravity') as GravityComponent
        if (gravity) {
          if (isWall) gravity.setGroundStatus(true)
          else gravity.setRidingStatus(true)
        }
        const jumping = entityA.getComponent('jump') as JumpComponent
        if (jumping) jumping.setIsJumping(false)
        const wallCollisionComponent = entityA.getComponent('wallCollision') as WallCollisionComponent
        if (wallCollisionComponent) wallCollisionComponent.setIsSliding(false, check[1])
        if (entityA.name === 'player' && !isWall && gravity.isRiding && (this.keys.size === 0 && this.source.playerL === false && this.source.playerR === false)) {
          if (velocityA && velocityB) {
            velocityA.setVelocity(velocityB.x, velocityA.y)
          }
        }
      }
      if (check[1] === 'top') {
        const wallCollisionComponent = entityA.getComponent('wallCollision') as WallCollisionComponent
        if (wallCollisionComponent) wallCollisionComponent.setIsSliding(false, '')
      }
      if (velocityA) velocityA.setVelocity(velocityA.x, 0)
      if (velocityB) velocityB.setVelocity(velocityB.x, 0)
    }
  }
}