import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { CreateEntity } from './entities/Create'
import { Entity } from './entities/Entity'
import { bigDemoEntity, demoEntity, floor, player } from './entities/templates'
import { MovementSystem } from './systems/movement'
import { PhysicsSystem } from './systems/physics'
import { RenderSystem } from './systems/render'
import { World } from './util/World'

export class Engine {

    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: 2000, height: 1500 })
    name: String = 'Croplike'
    paused: Ref<Boolean> = ref(false)
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })
    world: World = new World(this)

    // Temps
    player: Entity

    constructor() {
        // set app
        this.app.stage.eventMode = 'static'
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        this.world.addEntity(CreateEntity(bigDemoEntity, this.world))
        this.world.addEntity(CreateEntity(demoEntity, this.world))
        this.world.addEntity(CreateEntity(floor, this.world))
        this.player = CreateEntity(player, this.world)
        this.world.addEntity(this.player)

        this.loadSystems(this.world)

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause()
            }
        })
        
        window.addEventListener('blur', () => {
            if (this.paused.value === false) this.pause()
        })
        
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                if (this.paused.value === false) this.pause()
            }
        })
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

    pause(): void {
        this.paused.value = !this.paused.value
        if (this.paused.value) this.pauseTicker()
        else this.resumeTicker()
    }

    pauseTicker(): void {
        this.app.ticker.stop()
        this.app.renderer.clear()
    }

    resumeTicker(): void {
        this.app.ticker.start()
    }

    update(delta: number) {
        if (!this.paused.value) this.world.update(delta)
    }

}
