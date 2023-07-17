import * as THREE from 'three'
import { Entity } from "../entities/Entity"
import { Component } from "./Component"
import { World } from "../util/World"

export class ThreeComponent extends Component {

    color: any
    threeObject: THREE.Mesh
    type: string = 'three'

    constructor(entity: Entity, world: World, options: { color: string | 0xffffff, size: { height: number, width: number } }) {
        super(entity, world)
        const { color, size } = options
        this.color = color
        const cubeGeometry = new THREE.PlaneGeometry()
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: color,
        })
        this.threeObject = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.setSize(size)
    }

    addToScene() {
        this.world.engine.scene.add(this.threeObject)
    }

    setPosition(position: { x: number, y: number }): void {
        this.threeObject.position.x = position.x
        this.threeObject.position.y = position.y
    }

    setSize(size: { height: number, width: number }): void {
        this.threeObject.scale.x = size.width
        this.threeObject.scale.y = size.height
    }
    removeFromScene() {
        this.world.engine.scene.remove(this.threeObject)
    }

}