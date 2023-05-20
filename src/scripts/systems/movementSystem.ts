import { GravityComponent, JumpComponent, PositionComponent, VelocityComponent, WallCollisionComponent } from "../components"
import { System } from "."
import { World } from "../util/World"
import { Engine } from "../Engine"

export class MovementSystem extends System {
    acceleration: number
    maxVelocity: number
    source: Engine
    type: string = 'movement'
    constructor(world: World, source: Engine) {
        super(world)
        this.maxVelocity = 4
        this.acceleration = 1
        this.source = source
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('position', 'velocity')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            const velocityComponent = entity.getComponent('velocity') as VelocityComponent
            // Reset velocity to zero if no keys are pressed
            if (entity.name === 'player') {
                const gravity = entity.getComponent('gravity') as GravityComponent
                const wallCollisionComponent = entity.getComponent('wallCollision') as WallCollisionComponent

                if ((this.keys.size === 0 || (this.keys.size === 1 && this.keys.has('ArrowUp'))) && (this.source.playerL === false && this.source.playerR === false) && !wallCollisionComponent.isSliding && !gravity.isRiding) {
                    velocityComponent.setVelocity(0, velocityComponent.y)
                }
                // Update velocity based on keys pressed
                if (this.keys.has('ArrowLeft') || this.source.playerL === true) {
                    velocityComponent.setVelocity(
                        Math.max(velocityComponent.x - this.acceleration, -this.maxVelocity),
                        velocityComponent.y
                    )
                    if (wallCollisionComponent.wallDirection === 'right') wallCollisionComponent.setIsSliding(false, '')
                }
                if (this.keys.has('ArrowRight') || this.source.playerR === true) {
                    velocityComponent.setVelocity(
                        Math.min(velocityComponent.x + this.acceleration, this.maxVelocity),
                        velocityComponent.y
                    )
                    if (wallCollisionComponent.wallDirection === 'left') wallCollisionComponent.setIsSliding(false, '')
                }
                if (this.keys.has('ArrowUp') && (gravity.isOnGround || gravity.isRiding)) {
                    const jumpComponent = entity.getComponent('jump') as JumpComponent
                    velocityComponent.setVelocity(velocityComponent.x, velocityComponent.y - jumpComponent.force)
                    jumpComponent.setIsJumping(true)
                    wallCollisionComponent.setIsSliding(false, '')
                    if (gravity) gravity.setGroundStatus(false)
                    if (gravity) gravity.setRidingStatus(false)
                }
                if (this.keys.has('ArrowUp') && wallCollisionComponent.isSliding) {
                    const jumpComponent = entity.getComponent('jump') as JumpComponent
                    const velocityX = wallCollisionComponent.wallDirection === 'left' ? velocityComponent.x += wallCollisionComponent.force : velocityComponent.x -= wallCollisionComponent.force
                    velocityComponent.setVelocity(velocityX, velocityComponent.y - wallCollisionComponent.force)
                    jumpComponent.setIsJumping(true)
                    wallCollisionComponent.setIsSliding(false, '')
                    if (gravity) gravity.setGroundStatus(false)
                    if (gravity) gravity.setRidingStatus(false)
                }
            } else if (entity.name === 'largeEntity') {
                if (positionComponent.x <= 50 && velocityComponent.x <= 0) {
                    velocityComponent.setVelocity(
                        Math.max(velocityComponent.x + this.acceleration, +2),
                        velocityComponent.y
                    )
                } else if (positionComponent.x >= 350 && velocityComponent.x >= 0) {
                    velocityComponent.setVelocity(
                        Math.max(velocityComponent.x - this.acceleration, -2),
                        velocityComponent.y
                    )
                }
            }
            // Update position based on velocity
            if (velocityComponent.x !== 0 || velocityComponent.y !== 0) {
                positionComponent.setPosition(
                    positionComponent.x + velocityComponent.x * deltaTime,
                    positionComponent.y + velocityComponent.y * deltaTime
                )
            }
        }
    }
}
