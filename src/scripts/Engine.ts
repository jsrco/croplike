import * as THREE from 'three'
import { Entity } from './entities/Entity'
import { CreateEntity } from './entities/Create'
import { player } from './entities/templates'
import { RenderSystem } from './systems/render'
import { ColorSwatch } from './util/ColorSwatch'
import { World } from './util/World'

export class Engine {

    clock: THREE.Clock = new THREE.Clock()
    name: String = 'Croplike'
    scene: THREE.Scene = new THREE.Scene()
    world: World = new World(this)

    // Temps
    player: Entity

    constructor() {
        console.log("three.js engine running")
        this.scene.background = new THREE.Color(ColorSwatch.bgDark) // Set background color
        
        this.player = CreateEntity(player, this.world)
        const axesHelper = new THREE.AxesHelper( 5 )
        this.scene.add( axesHelper )
        
        this.world.addEntity(this.player)

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
        // this.player.scale.x = this.player.scale.x += .1
        // this.player.scale.y = this.player.scale.y += .1
        // Call update again on the next frame
        window.requestAnimationFrame(this.update.bind(this))
        // this.player.position.setX(this.player.position.x + (.3 * elapsedTime / 1000));
    }
}
