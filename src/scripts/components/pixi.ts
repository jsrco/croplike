import * as PIXI from "pixi.js"
import { Entity } from "../entities/entity"
import { World } from "../util/world"
import { Component } from "./component"

export class PixiComponent extends Component {

    color: string
    sprite: PIXI.Sprite
    type: string = 'pixi'

    moveLeft: boolean = false
    moveRight: boolean = false

    constructor(entity: Entity, world: World, options: { color: string | '#ffffff', moveLeft?: boolean, moveRight?: boolean }) {
        super(entity, world)
        const { color, moveLeft, moveRight } = options
        this.color = color
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        this.sprite.tint = this.color

        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))

        // temp pat
        if (moveLeft && moveRight) {
            this.moveLeft = moveLeft
            this.moveRight = moveRight
        }
    }

    addToStage() {
        this.world.engine.app.stage.addChild(this.sprite)
    }

    onPositionChange(data: any): void {
        if (data.entity.id === this.owner.id) {
            const positionComponent = data.positionComponent
            this.sprite.x = positionComponent.position.x
            this.sprite.y = positionComponent.position.y
        }
    }

    onSizeChange(data: any): void {
        if (data.entity.id === this.owner.id) {
            const sizeComponent = data.sizeComponent
            this.sprite.height = sizeComponent.size.y
            this.sprite.width = sizeComponent.size.x
        }
    }

    removeFromStage() {
        this.world.engine.app.stage.removeChild(this.sprite)
    }

}