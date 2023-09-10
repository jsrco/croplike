import { PixiComponent } from "../components/pixi"
import { Entity } from "../entities/entity"
import { System } from "./system"
import { World } from "../util/world"

export class RenderSystem extends System {

    stageCenterX: number = window.innerWidth / 2 // Assuming the stage width is the same as the window width
    stageCenterY: number = (window.innerHeight - 36) / 2 // Assuming the stage height is the same as the window height
    target: Entity
    targetInfo: PixiComponent
    type: string = 'render'

    constructor(world: World) {
        super(world)

        this.target = this.world.engine.player
        this.targetInfo = this.target.getComponent('pixi') as PixiComponent
        // Entities
        const entities = this.getEntitiesByComponent('pixi')
        for (const entity of entities) {
            const pixiComponent = entity.getComponent('pixi') as PixiComponent
            pixiComponent.addToStage()
        }
        window.addEventListener('resize', () => {
            this.stageCenterX = window.innerWidth / 2
            this.stageCenterY = window.innerHeight / 2
        })
    }

    adjustCamera(): void {
        const targetCenterX = this.targetInfo.sprite.x + this.targetInfo.sprite.width / 2
        const targetCenterY = this.targetInfo.sprite.y + this.targetInfo.sprite.height / 2
        const left = 0
        const top = 0
        const right = this.world.engine.app.renderer.width
        const bottom = this.world.engine.app.renderer.height
        let stagePositionX = this.stageCenterX - targetCenterX
        let stagePositionY = this.stageCenterY - targetCenterY
        if (stagePositionX > left) {
            stagePositionX = left
        } else if (stagePositionX + right < window.innerWidth) {
            stagePositionX = window.innerWidth - right
        }
        if (stagePositionY > top) {
            stagePositionY = top
        } else if (stagePositionY + bottom < window.innerHeight - 36) {
            stagePositionY = window.innerHeight - 36 - bottom
        }
        this.world.engine.app.stage.position.set(stagePositionX, stagePositionY)
    }

    appendElement(elementRef: any): void {
        elementRef.appendChild(this.world.engine.app.view)
    }

    update(deltaTime: number): void {
        // Camera
        this.adjustCamera()
        // handle any sprites here for future        
    }

}

