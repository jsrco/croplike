import * as THREE from 'three'
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class GraphicsComponent extends Component {

    color: any
    threeObject: THREE.Mesh
    type: string = 'graphics'

    constructor(entity: Entity, world: World, color = 0xffffff) {
        super(entity, world)
        this.color = color
        const cubeGeometry = new THREE.PlaneGeometry(.25, .25, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: color,
        })
        this.threeObject = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.world.eventManager.subscribe('positionChange', this.onPositionChange.bind(this))
        this.world.eventManager.subscribe('sizeChange', this.onSizeChange.bind(this))
    }

    addToScene() {
        this.world.engine.scene.add(this.threeObject)
    }

    onPositionChange(data: any): void {
        if (data.entity === this.owner) {
            const positionComponent = data.positionComponent
            this.threeObject.position.x = positionComponent.x
            this.threeObject.position.y = positionComponent.y
        }
    }

    onSizeChange(data: any): void {
        if (data.entity === this.owner) {
            const sizeComponent = data.sizeComponent
            this.threeObject.scale.x = sizeComponent.width
            this.threeObject.scale.y = sizeComponent.height
        }
    }

    removeFromStage() {
        this.world.engine.scene.remove(this.threeObject)
    }

}