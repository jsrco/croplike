import * as THREE from 'three'
import { ColorSwatch } from './util/ColorSwatch'
import { RenderSystem } from './systems/render'
import { World } from './util/World'

export class Engine {

    clock: THREE.Clock = new THREE.Clock()
    name: String = 'Croplike'
    scene: THREE.Scene = new THREE.Scene()
    world: World = new World(this)
    
// Temps

    constructor() {
        console.log("three.js engine running")
        this.scene.background = new THREE.Color(ColorSwatch.bgDark) // Set background color
        // Object
        const cubeGeometry = new THREE.PlaneGeometry(.05, .05, 1)
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: '#ff0000'
        })
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.scene.add(cubeMesh)

        this.loadSystems(this.world)

        // Start Engine
        console.log("starting update")
        this.update()
    }

    addCanvas(elementRef: HTMLElement) {
       const render = this.world.getSystemByType('render') as RenderSystem
       if (render) render.appendElement(elementRef)
       else console.log("still loading.")
    }

    loadSystems(world: World): void {
        world.addSystem(new RenderSystem(world))
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        this.world.update(elapsedTime)
    }

}
