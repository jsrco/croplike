import { PositionComponent } from "../components/position"
import { VelocityComponent } from "../components/velocity"
import { System } from "./System"
import { World } from "../util/World"
import { Engine } from "../Engine"

export class MovementSystem extends System {

    acceleration: number
    engine: Engine
    maxVelocity: number
    type: string = 'movement'
    
    constructor(world: World, engine: Engine) {
        super(world)
        this.engine = this.world.engine
        this.acceleration = .002
        this.maxVelocity = .008
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('position', 'velocity')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            const velocityComponent = entity.getComponent('velocity') as VelocityComponent
            // Reset velocity to zero if no keys are pressed
            if (this.keys.size === 0) {
                velocityComponent.setVelocity(0, velocityComponent.y)
            }

            if (entity.name === 'player') {
                // Update velocity based on keys pressed
                if (this.keys.has('ArrowLeft')) {
                    velocityComponent.setVelocity(
                        Math.max(velocityComponent.x - this.acceleration, -this.maxVelocity),
                        velocityComponent.y
                    )
                }
                if (this.keys.has('ArrowRight')) {
                    velocityComponent.setVelocity(
                        Math.min(velocityComponent.x + this.acceleration, this.maxVelocity),
                        velocityComponent.y
                    )
                }
            }
            // Update position based on velocity
            if (velocityComponent.x !== 0 || velocityComponent.y !== 0) {
                positionComponent.setPosition(
                    positionComponent.x + velocityComponent.x, // * deltaTime
                    positionComponent.y + velocityComponent.y  // * deltaTime 
                )
            }
        }
    }
}
