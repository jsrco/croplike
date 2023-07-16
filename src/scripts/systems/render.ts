import * as THREE from 'three'
import { GraphicsComponent } from "../components/graphics"
import { System } from "./System"
import { World } from "../util/World"

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
        const entities = this.getEntitiesByComponent('graphics')
        for (const entity of entities) {
            const GraphicsComponent = entity.getComponent("graphics") as GraphicsComponent
            GraphicsComponent.addToScene()
            if (GraphicsComponent.owner.name === 'player') {
                this.cameraTarget = GraphicsComponent.threeObject
            }
        }

        // Resize Event
        window.addEventListener('resize', () => {
            // Update sizes
            this.aspects.height = window.innerHeight
            this.aspects.width = window.innerWidth
            this.aspectRatio = this.aspects.width / this.aspects.height
            // Update camera
            this.camera.left = -1 * this.aspectRatio
            this.camera.right = 1 * this.aspectRatio
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

