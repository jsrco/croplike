import { PositionComponent, VelocityComponent } from "../components"
import { System } from "./System"
import { World } from "../util/World"

export class MovementSystem extends System {
    private keys: Set<string>
    private maxVelocity: number
    private acceleration: number

    constructor(world: World) {
        super(world)
        this.world.eventManager.subscribe('keyChange', this.onKeyChange.bind(this))
        this.keys = new Set<string>()
        this.maxVelocity = 5
        this.acceleration = 1
    }

    update(deltaTime: number): void {
        const entities = this.world.getEntitiesByComponent('position', 'velocity')
        for (const entity of entities) {
            const positionComponent = entity.getComponent('position') as PositionComponent
            const velocityComponent = entity.getComponent('velocity') as VelocityComponent
            // Reset velocity to zero if no keys are pressed
            if (this.keys.size === 0) {
                velocityComponent.setVelocity(0, velocityComponent.y)
            }
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
            // Update position based on velocity
            if (velocityComponent.x !== 0 || velocityComponent.y !== 0) {
                positionComponent.setPosition(
                    positionComponent.x + velocityComponent.x * deltaTime,
                    positionComponent.y + velocityComponent.y * deltaTime
                )
            }
        }
    }

    private onKeyChange(data: any): void {
        const { key, isDown } = data
        if (isDown) {
            this.keys.add(key)
        } else {
            this.keys.delete(key)
        }
    }
}
