import { PixiComponent } from "../components/pixi"
import { RapierComponent } from "../components/rapier"
import { World } from "../util/world"
import { System } from "./system"

export class MovementSystem extends System {

    acceleration: number
    maxVelocity: number
    type: string = 'movement'

    constructor(world: World) {
        super(world)
        this.acceleration = 20
        this.maxVelocity = 160
    }

    jump(component: RapierComponent): void {
        const currentVelocity = component.body.linvel()
        component.setVelocity({ x: currentVelocity.x, y: -200 })
        component.setIsOnGround(false)
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

    wallJump(component: RapierComponent): void {
        const currentVelocity = component.body.linvel()
        component.setVelocity({ x: -(currentVelocity.x >= 0 ? 120 : -120), y: -175 })
        component.setIsOnGround(false)
    }

    update(deltaTime: number): void {
        const entities = this.getEntitiesByComponent('rapier')
        for (const entity of entities) {
            const rapierComponent = entity.getComponent('rapier') as RapierComponent

            // Reset velocity to zero if no keys are pressed
            if (this.keys.size === 0 && entity.name === 'player' && !rapierComponent.isRiding) {
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
                if (this.keys.has('ArrowUp') && rapierComponent.isOnGround && !rapierComponent.isStoodOn) {
                    this.jump(rapierComponent)
                }
                if (this.keys.has('ArrowUp') && rapierComponent.isColliding && !rapierComponent.isStoodOn && (rapierComponent.body.linvel().y >= 0 && rapierComponent.body.linvel().y <= 0.01)) {
                    this.wallJump(rapierComponent)
                }
            }

            if (entity.name === 'bigDemo') {
                const pixiComponent = entity.getComponent('pixi') as PixiComponent
                if (pixiComponent.position.x <= 300) {
                    pixiComponent.moveLeft = false
                    pixiComponent.moveRight = true
                } else if (pixiComponent.position.x >= 800) {
                    pixiComponent.moveLeft = true
                    pixiComponent.moveRight = false
                }
                if (pixiComponent.moveLeft === true) {
                    rapierComponent.setVelocity({
                        x: -60,
                        y: rapierComponent.velocity.y
                    })
                }
                if (pixiComponent.moveRight === true) {
                    rapierComponent.setVelocity({
                        x: 60,
                        y: rapierComponent.velocity.y
                    })
                }
            }
        }
    }

}
