import * as THREE from 'three'
import { ThreeComponent } from "../components/three"
import { World } from "../util/World"
import { System } from "./System"

export class RenderSystem extends System {

    aspects: {
        height: number,
        width: number
    } = {
            height: window.innerHeight,
            width: window.innerWidth
        }
    aspectRatio: number = this.aspects.width / this.aspects.height
    camera: THREE.OrthographicCamera
    cameraTarget!: THREE.Mesh
    frustum: number = 15
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
    type: string = 'render'

    constructor(world: World) {
        super(world)
        this.camera = new THREE.OrthographicCamera(-this.frustum * this.aspectRatio, this.frustum * this.aspectRatio, this.frustum, -this.frustum, 0, 100)
        this.renderer.setSize(this.aspects.width, this.aspects.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Entities
        const entities = this.getEntitiesByComponent('three')
        for (const entity of entities) {
            const threeComponent = entity.getComponent('three') as ThreeComponent
            threeComponent.addToScene()
            if (threeComponent.owner.name === 'player') {
                this.cameraTarget = threeComponent.threeObject
            }
        }

        // Resize Event
        window.addEventListener('resize', () => {
            // Update sizes
            this.aspects.height = window.innerHeight
            this.aspects.width = window.innerWidth
            this.aspectRatio = this.aspects.width / this.aspects.height
            // Update camera
            this.camera.left = -this.frustum * this.aspectRatio
            this.camera.right = this.frustum * this.aspectRatio
            this.camera.updateProjectionMatrix()
            // Update renderer
            this.renderer.setSize(this.aspects.width, this.aspects.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }

    appendElement(elementRef: HTMLElement): void {
        elementRef.appendChild(this.renderer.domElement)
    }

    update(deltaTime: number): void {
        this.renderer.render(this.engine.scene, this.camera)
        if (this.world.engine.player) this.camera.position.copy(this.cameraTarget.position)
        // handle the logic to clamp to scene here
    }

}

