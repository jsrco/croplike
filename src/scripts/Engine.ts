import * as THREE from 'three'
import { World } from './util/World'

export class Engine {

    aspects: {
        height: number,
        width: number
    } = {
            height: window.innerHeight,
            width: window.innerWidth
        }
    aspectRatio: number = this.aspects.width / this.aspects.height
    camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1 * this.aspectRatio, 1 * this.aspectRatio, 1, -1, 0.1, 100)
    clock: THREE.Clock = new THREE.Clock()
    name: String = 'Croplike'
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
    scene: THREE.Scene = new THREE.Scene()
    world: World = new World(this)
    
    constructor() {
        console.log("three.js engine running")
        this.scene.background = new THREE.Color('#1d1d1d') // Set background color
        this.renderer.setSize(this.aspects.width, this.aspects.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Object
        const cubeGeometry = new THREE.PlaneGeometry(.1, .1, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: '#ff0000'
        })
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.scene.add(cubeMesh)

        this.camera.position.z = 1

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

        // Start Engine
        console.log("starting update")
        this.update()
    }

    appendElement(elementRef: any): void {
        elementRef.appendChild(this.renderer.domElement)
        console.log("canvas appended to element", elementRef)
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        // Render
        this.renderer.render(this.scene, this.camera)
        // Call update again on the next frame
        window.requestAnimationFrame(this.update.bind(this))
    }
}
