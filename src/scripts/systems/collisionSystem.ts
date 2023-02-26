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
        let collisionSide: string = ''

        if (itDidHappen) {
            const positionA = entityA.getComponent('position') as PositionComponent
            const positionB = entityB.getComponent('position') as PositionComponent
            const sizeA = entityA.getComponent('size') as SizeComponent
            const sizeB = entityB.getComponent('size') as SizeComponent
            // implment logic to check which side the collision occured on
            // Determine direction of collision
            const deltaX = (positionA.x + sizeA.width / 2) - (positionB.x + sizeB.width / 2)
            const deltaY = (positionA.y + sizeA.height / 2) - (positionB.y + sizeB.height / 2)
            const intersectX = Math.abs(deltaX) - (sizeA.width / 2 + sizeB.width / 2)
            const intersectY = Math.abs(deltaY) - (sizeA.height / 2 + sizeB.height / 2)

            if (intersectX < intersectY) {
                collisionSide = deltaX > 0 ? 'left' : 'right'
            } else {
                collisionSide = deltaY > 0 ? 'top' : 'bottom'
            }
        }

        return [itDidHappen, collisionSide]
    }
    private handleCollision(entityA: Entity, entityB: Entity, whereItHappened: string): void {
        const velocityA = entityA.getComponent('velocity') as VelocityComponent
        const velocityB = entityB.getComponent('velocity') as VelocityComponent
        console.log('collision' + whereItHappened)
        // Implement collision response here
        // handle the collision basesd off whereItHappened
        // collisions on left and right, should set the entity x veloicty to 0 to prevent movement left and right 
        // collisions on the top and bottom, should set the entity y veloicty to 0 to prevent gravity and jumping. 

    }
}
