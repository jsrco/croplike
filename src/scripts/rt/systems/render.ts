import { PixiComponent } from "../components/pixi"
import { Entity } from "../entities/entity"
import { Room } from "../util/room"
import { System } from "./system"

export class RenderSystem extends System {

    stageCenterX: number = window.innerWidth / 2 // Assuming the stage width is the same as the window width
    stageCenterY: number = (window.innerHeight - 36) / 2 // Assuming the stage height is the same as the window height
    target: Entity
    targetInfo: PixiComponent
    type: string = 'render'

    constructor(room: Room) {
        super(room)

        this.target = this.room.engine.player
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
        const roomWidth = this.room.roomDimensions.x
        const roomHeight = this.room.roomDimensions.y
        const left = 0
        const top = 0
        const right = roomWidth
        const bottom = roomHeight
        let stagePositionX = this.stageCenterX - targetCenterX
        let stagePositionY = this.stageCenterY - targetCenterY

        // Calculate the maximum allowable stage positions
        const maxStagePositionX = Math.min(left, window.innerWidth - right)
        const maxStagePositionY = Math.min(top, window.innerHeight - 36 - bottom)

        // Ensure stagePositionX and stagePositionY stay within the boundaries
        stagePositionX = Math.max(maxStagePositionX, Math.min(stagePositionX, 0))
        stagePositionY = Math.max(maxStagePositionY, Math.min(stagePositionY, 0))

        this.room.engine.app.stage.position.set(stagePositionX, stagePositionY)
    }

    appendElement(elementRef: any): void {
        elementRef.appendChild(this.room.engine.app.view)
    }

    update(deltaTime: number): void {
        // Camera
        this.adjustCamera()
        // handle any sprites here for future        
    }

}

