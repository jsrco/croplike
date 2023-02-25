import { Entity } from '../entities/Entity'
import { CollisionComponent, PositionComponent } from '../components'
import { System } from './System'
import { World } from '../util/World'

export class CollisionSystem extends System {
    constructor(world: World) {
        super(world)
    }

    update(deltaTime: number): void {
        const entities = this.world.getEntitiesByComponent('position', 'collision')
        for (let i = 0; i < entities.length; i++) {
            const entityA = entities[i]
            const collisionA = entityA.getComponent('collision') as CollisionComponent

            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j]
                const collisionB = entityB.getComponent('collision') as CollisionComponent
                if (this.checkCollision(collisionA, collisionB)) {
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

    private handleCollision(entityA: Entity, entityB: Entity): void {
        // Implement collision response here
        console.log('collisoin occured')
    }
}
