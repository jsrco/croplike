import { System } from "."
import { World } from "../../util/World"
import { PositionComponent, SizeComponent } from "../components"
import { Entity } from "../entities/Entity"

export class CameraSystem extends System {
    target: Entity

    constructor(world: World, entity: Entity) {
        super(world)
        this.target = entity
    }

    update(deltaTime: number): void {
        const stageCenterX = window.innerWidth / 2 // Assuming the stage width is the same as the window width
        const stageCenterY = window.innerHeight / 2 // Assuming the stage height is the same as the window height

        const targetPosition = this.target.getComponent('position') as PositionComponent
        const targetSize = this.target.getComponent('size') as SizeComponent

        const targetCenterX = targetPosition.x + targetSize.width / 2
        const targetCenterY = targetPosition.y + targetSize.height / 2

        const left = 0
        const top = 0
        const right = this.world.app.renderer.width
        const bottom = this.world.app.renderer.height

        let stagePositionX = stageCenterX - targetCenterX
        let stagePositionY = stageCenterY - targetCenterY

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

        this.world.app.stage.position.set(stagePositionX, stagePositionY)
    }
}
