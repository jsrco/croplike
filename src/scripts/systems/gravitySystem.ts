import { GravityComponent, PositionComponent, VelocityComponent, WallCollisionComponent } from '../components/index'
import { System } from './System'
import { World } from '../util/World'

export class GravitySystem extends System {
    maxVelocity: number = 4
    constructor(world: World) {
        super(world)
    }

    update(deltaTime: number): void {
        const entities = this.world.getEntitiesByComponent('gravity', 'position', 'velocity')

        for (const entity of entities) {
            const gravityComponent = entity.getComponent('gravity') as GravityComponent
            if (!gravityComponent.isOnGround) {
                const positionComponent = entity.getComponent('position') as PositionComponent
                const velocityComponent = entity.getComponent('velocity') as VelocityComponent
                const wallCollisionComponent = entity.getComponent('wallCollision') as WallCollisionComponent
                if (wallCollisionComponent.isSliding) {
                    wallCollisionComponent.setWallSlideSpeed(wallCollisionComponent.wallSlideSpeed -= .02)
                    velocityComponent.setVelocity(velocityComponent.x, Math.min(velocityComponent.y = wallCollisionComponent.wallSlideSpeed * deltaTime, this.maxVelocity))
                    positionComponent.setPosition(positionComponent.x, positionComponent.y += velocityComponent.y * deltaTime)
                } else {
                    velocityComponent.setVelocity(velocityComponent.x, Math.min(velocityComponent.y += gravityComponent.force * deltaTime, this.maxVelocity))
                    positionComponent.setPosition(positionComponent.x, positionComponent.y += velocityComponent.y * deltaTime)
                }
            }
        }
    }
}
