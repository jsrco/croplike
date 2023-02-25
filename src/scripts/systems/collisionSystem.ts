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

        const previousPositionA = {
            x: positionA.previousPositionX,
            y: positionA.previousPositionY
        }
        const previousPositionB = {
            x: positionB.previousPositionX,
            y: positionB.previousPositionY
        }

        const sizeA = entityA.getComponent('size') as SizeComponent
        const sizeB = entityB.getComponent('size') as SizeComponent

        const dx = (previousPositionA.x + sizeA.width / 2) - (previousPositionB.x + sizeB.width / 2)
        const dy = (previousPositionA.y + sizeA.height / 2) - (previousPositionB.y + sizeB.height / 2)

        const width = (sizeA.width + sizeB.width) / 2
        const height = (sizeA.height + sizeB.height) / 2

        const crossWidth = width * dy
        const crossHeight = height * dx

        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                return crossWidth > (-crossHeight) ? 'bottom' : 'left'
            } else {
                return crossWidth > (-crossHeight) ? 'right' : 'top'
            }
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
