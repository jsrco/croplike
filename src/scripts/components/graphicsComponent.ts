import * as PIXI from "pixi.js"
import { Entity } from "../entities/Entity"
import { Component } from "."
import { World } from "../util/World"

export class GraphicsComponent extends Component {
    color: any
    sprite: PIXI.Sprite
    type: string = 'graphics'

    constructor(entity: Entity, world: World, color = 0x00000) {
        super(entity, world)
        this.color = color
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = color
        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }
    addToStage() {
        this.world.app.stage.addChild(this.sprite)
    }
    onPositionChange(data: any): void {
        if (data.entity === this.owner) {
            const positionComponent = data.positionComponent
            this.sprite.x = positionComponent.x
            this.sprite.y = positionComponent.y
        }
    }
    onSizeChange(data: any): void {
        if (data.entity === this.owner) {
            const sizeComponent = data.sizeComponent
            this.sprite.height = sizeComponent.height
            this.sprite.width = sizeComponent.width
        }
    }
    removeFromStage() {
        this.world.app.stage.removeChild(this.sprite)
    }
}