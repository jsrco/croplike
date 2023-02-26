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
        // check for collisions and the side they occured on
        // handle collision logic
    }

    private checkCollision(
        collisionA: CollisionComponent,
        collisionB: CollisionComponent
    ): boolean {
        return collisionA.rectangle.intersects(collisionB.rectangle)
    }
    private getCollisionSide(entityA: Entity, entityB: Entity): string {
        const positionA = entityA.getComponent('position') as PositionComponent
        const positionB = entityB.getComponent('position') as PositionComponent

        const sizeA = entityA.getComponent('size') as SizeComponent
        const sizeB = entityB.getComponent('size') as SizeComponent

        const collisionSide = false || 'top' || 'right' || 'down' || 'left'

        // logic for determening collisionSide goes here

        return collisionSide
    }

    private handleCollision(entityA: Entity, entityB: Entity): void {
        const velocityA = entityA.getComponent('velocity') as VelocityComponent
        const velocityB = entityB.getComponent('velocity') as VelocityComponent

        // Implement collision response here
        // since both entities have been determined to be colliding, call getCollisionSide
        // handle the collision basesd of the entities side


    }
}
