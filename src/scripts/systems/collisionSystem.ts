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
            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j]
                const collisionB = entityB.getComponent('collision') as CollisionComponent
                const check = this.checkCollision(entityA, entityB)
                if (check[0]) {
                    this.handleCollision(entityA, entityB, check[1])
                }
            }
        }

    }
    private checkCollision(entityA: Entity, entityB: Entity): [boolean, string] {
        const collisionA = entityA.getComponent('collision') as CollisionComponent
        const collisionB = entityB.getComponent('collision') as CollisionComponent

        const itDidHappen = collisionA.rectangle.intersects(collisionB.rectangle)
        const collisionSide: string = 'bottom' || 'left' || 'right' || 'top'

        if (itDidHappen) {
            const positionA = entityA.getComponent('position') as PositionComponent
            const positionB = entityB.getComponent('position') as PositionComponent
            const sizeA = entityA.getComponent('size') as SizeComponent
            const sizeB = entityB.getComponent('size') as SizeComponent
            // implment logic to check which side the collision occured on
        }

        return [itDidHappen, collisionSide]
    }
    private handleCollision(entityA: Entity, entityB: Entity, whereItHappened: string): void {
        const velocityA = entityA.getComponent('velocity') as VelocityComponent
        const velocityB = entityB.getComponent('velocity') as VelocityComponent

        // Implement collision response here
        // handle the collision basesd off whereItHappened
        // collisions on left and right, should set the entity x veloicty to 0 to prevent movement left and right 
        // collisions on the top and bottom, should set the entity y veloicty to 0 to prevent gravity and jumping. 

    }
}
