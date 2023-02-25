import { Entity } from '../entities/Entity'
import { CollisionComponent, PositionComponent, SizeComponent, VelocityComponent } from '../components'
import { System } from './System'
import { World } from '../util/World'

export class CollisionSystem extends System {
    constructor(world: World) {
        super(world)
    }

    update(deltaTime: number): void {
        const entities = this.world.getEntitiesByComponent('collision', 'position', 'velocity')
        for (let i = 0; i < entities.length; i++) {
            const entityA = entities[i]
            const collisionA = entityA.getComponent('collision') as CollisionComponent

            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j]
                const collisionB = entityB.getComponent('collision') as CollisionComponent
                if (this.checkCollision(collisionA, collisionB)) {
                    console.log('collision occured')
                    this.handleCollision(entityA, entityB)
                }
            }
        }
    }

    private checkCollision(
        collisionA: CollisionComponent,
        collisionB: CollisionComponent
    ): boolean {
        // Implement collision detection algorithm here
        return collisionA.rectangle.intersects(collisionB.rectangle)
    }
    private getCollisionSide(entityA: Entity, entityB: Entity): string {
        const positionA = entityA.getComponent('position') as PositionComponent
        const positionB = entityB.getComponent('position') as PositionComponent

        const sizeA = entityA.getComponent('size') as SizeComponent
        const sizeB = entityB.getComponent('size') as SizeComponent

        const xDiff = positionA.x - positionA.previousPositionX
        const yDiff = positionA.y - positionA.previousPositonY
        const otherLeft = positionB.x
        const otherRight = positionB.x + sizeB.width
        const otherTop = positionB.y
        const otherBottom = positionB.y + sizeB.height

        if (yDiff > 0 && positionA.y < otherTop && positionA.previousPositonY >= otherTop) {
            return 'top'
        } else if (yDiff < 0 && positionA.y + sizeA.height > otherBottom && positionA.previousPositonY + sizeA.height <= otherBottom) {
            return 'bottom'
        } else if (xDiff > 0 && positionA.x < otherLeft && positionA.previousPositionX >= otherLeft) {
            return 'left'
        } else if (xDiff < 0 && positionA.x + sizeA.width > otherRight && positionA.previousPositionX + sizeA.width <= otherRight) {
            return 'right'
        }
        return ''
    }
    private handleCollision(entityA: Entity, entityB: Entity): void {
        // Implement collision response here
        const velocityA = entityA.getComponent('velocity') as VelocityComponent
        const velocityB = entityB.getComponent('velocity') as VelocityComponent
        const collisionData = this.getCollisionSide(entityA, entityB)
        console.log(collisionData)
        if (collisionData === 'top' || collisionData === 'bottom') {
            velocityA.setVelocity(velocityA.x, 0)
            velocityB.setVelocity(velocityA.x, 0)
        }

        if (collisionData === 'left' || collisionData === 'right') {
            velocityA.setVelocity(0, velocityA.y)
            velocityB.setVelocity(0, velocityB.y)
        }
    }
}
