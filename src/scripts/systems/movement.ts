import { RapierComponent } from "../components/rapier"
import { System } from "./System"
import { World } from "../util/World"

export class MovementSystem extends System {

    acceleration: number
    maxVelocity: number
    type: string = 'movement'

    constructor(world: World) {
        super(world)
        this.acceleration = 2
        this.maxVelocity = 12
    }

    moveLeft(component: RapierComponent): void {
        const currentVelocity = component.body.linvel()
        component.setVelocity({
            x: Math.max(currentVelocity.x - this.acceleration, -this.maxVelocity),
            y: currentVelocity.y
        })
    }

    moveRight(component: RapierComponent): void {
        const currentVelocity = component.body.linvel()
        component.setVelocity({
            x: Math.min(currentVelocity.x + this.acceleration, this.maxVelocity),
            y: currentVelocity.y
        })
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('rapier')
        for (const entity of entities) {
            const rapierComponent = entity.getComponent('rapier') as RapierComponent
            // Reset velocity to zero if no keys are pressed
            if (this.keys.size === 0 && entity.name === 'player') {
                const currentVelocity = rapierComponent.body.linvel()
                rapierComponent.setVelocity({ x: 0, y: currentVelocity.y })
            }

            if (entity.name === 'player') {
                // Update velocity based on keys pressed
                if (this.keys.has('ArrowLeft')) {
                    this.moveLeft(rapierComponent)
                }
                if (this.keys.has('ArrowRight')) {
                    this.moveRight(rapierComponent)
                }
                if (this.keys.has('ArrowUp') && (rapierComponent.isOnGround)) {
                    // check in unit is touching ground or another unit.
                    // demo jump for testing normal value
                    const currentVelocity = rapierComponent.body.linvel()
                    rapierComponent.setVelocity({ x: currentVelocity.x, y: 15})
                    rapierComponent.setIsOnGround(false)
                }
                if (this.keys.has('ArrowUp') && !rapierComponent.isOnGround && rapierComponent.body.linvel().y === 0) {
                    // check in unit is touching ground or another unit.
                    // demo jump for testing normal value
                    const currentVelocity = rapierComponent.body.linvel()
                    rapierComponent.setVelocity({ x: -(currentVelocity.x*6), y: 15 })
                    rapierComponent.setIsOnGround(false)
                }
            }
        }
    }

}
