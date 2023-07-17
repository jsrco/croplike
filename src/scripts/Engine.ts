import * as THREE from 'three'
import { Entity } from './entities/Entity'
import { CreateEntity } from './entities/Create'
import { demoEntity, floor, player } from './entities/templates'
import { MovementSystem } from './systems/movement'
import { PhysicsSystem } from './systems/physics'
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
        this.scene.background = new THREE.Color(ColorSwatch.bgDark) // Set background color
        
        this.world.addEntity(CreateEntity(demoEntity, this.world))
        this.world.addEntity(CreateEntity(floor, this.world))
        this.player = CreateEntity(player, this.world)
        this.world.addEntity(this.player)


        const axesHelper = new THREE.AxesHelper( 5 )
        this.scene.add( axesHelper )

        this.loadSystems(this.world)

        // Start Engine
        this.update()
    }

    addCanvas(elementRef: HTMLElement) {
        const render = this.world.getSystemByType('render') as RenderSystem
        if (render) render.appendElement(elementRef)
        else console.log("still loading.")
    }

    loadSystems(world: World): void {
        world.addSystem(new MovementSystem(world))
        world.addSystem(new PhysicsSystem(world))
        world.addSystem(new RenderSystem(world))
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime()
        this.world.update(elapsedTime)
        // Call update again on the next frame
        window.requestAnimationFrame(this.update.bind(this))
    }

}
