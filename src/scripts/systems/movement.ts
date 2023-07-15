import { PositionComponent } from "../components/position"
import { VelocityComponent } from "../components/velocity"
import { System } from "./System"
import { World } from "../util/World"

export class MovementSystem extends System {

    acceleration: number
    maxVelocity: number
    type: string = 'movement'

    constructor(world: World) {
        super(world)
        this.acceleration = .002
        this.maxVelocity = .008
    }

    moveLeft(component: VelocityComponent): void {
        component.setVelocity(
            Math.max(component.x - this.acceleration, -this.maxVelocity),
            component.y
        )
    }

    moveRight(component: VelocityComponent): void {
        component.setVelocity(
            Math.min(component.x + this.acceleration, this.maxVelocity),
            component.y
        )
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
                    this.moveLeft(velocityComponent)
                }
                if (this.keys.has('ArrowRight')) {
                    this.moveRight(velocityComponent)
                }
            }
            // Update position based on velocity
            if (velocityComponent.x !== 0 || velocityComponent.y !== 0) {
                positionComponent.setPosition(
                    positionComponent.x + velocityComponent.x, // * deltaTime,
                    positionComponent.y + velocityComponent.y, // * deltaTime, 
                )
            }
        }
    }

}
