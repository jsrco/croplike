import * as THREE from 'three'
import { System } from "./System"
import { World } from "../util/World"
import { Engine } from "../Engine"

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
    engine: Engine
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
    type: string = 'render'

    constructor(world: World) {
        super(world)
        this.engine = this.world.engine
        this.camera = new THREE.OrthographicCamera(-1 * this.aspectRatio, 1 * this.aspectRatio, 1, -1, 0, 100)
        this.renderer.setSize(this.aspects.width, this.aspects.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
        console.log("canvas appended to element", elementRef)
    }

    update(deltaTime: number): void {
        this.renderer.render(this.engine.scene, this.camera)
        // Call update again on the next frame
        window.requestAnimationFrame(this.update.bind(this))
    }

}

