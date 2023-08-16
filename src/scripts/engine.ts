import * as PIXI from "pixi.js"
import RAPIER from "@dimforge/rapier2d"
import { Ref, ref } from "vue"
import { CreateEntity, EntityMap } from './entities/create'
import { Entity } from './entities/entity'
import { bigDemoEntity, demoEntity, player, wall } from './entities/templates'
import { MovementSystem } from './systems/movement'
import { PhysicsSystem } from './systems/physics'
import { RenderSystem } from './systems/render'
import { LocalStorageManager } from "./util/local-storage-manager"
import { SaveManager } from "./util/save-manager"
import { World } from './util/world'
export class Engine {

    appDimensions: RAPIER.Vector2 = { x: 1800, y: 1500 }
    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: this.appDimensions.x, height: this.appDimensions.y })
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    name: String = 'Croplike'
    paused: Ref<Boolean> = ref(false)
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })
    world: World = new World(this)

    // Temps
    player: Entity
    wallThickness: number = 40

    constructor() {
        // set app
        this.app.stage.eventMode = 'static'
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        this.world.addEntity(CreateEntity(bigDemoEntity, this.world))
        this.world.addEntity(CreateEntity(demoEntity, this.world))
        this.player = CreateEntity(player, this.world)
        this.world.addEntity(this.player)
        this.createBounds(this.world)
        this.loadSystems(this.world)

        window.addEventListener('keydown', (event) => {
            if (event.key === 'l') {
                this.load()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause()
            }
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 's') {
                this.save()
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

    load(): void {
        const saveData: any = this.localStorageManager.getData()
        if (Object.keys(saveData).length !== 0) {
            this.paused.value = true
            this.app.stage.removeChildren()
            this.world = new World(this)
            this.createBounds(this.world)
            saveData.entities.forEach((entity: EntityMap) => {
                this.saveManager.loadEntity(entity, this.world)
            })
            this.loadSystems(this.world)
            this.pause()
        } else console.log('no saved data')
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

    save(): void {
        this.paused.value = true
        this.localStorageManager.clearData()
        this.saveManager.clearData()
        this.saveManager.createAllEntityData(this.world)
        this.localStorageManager.saveData(this.saveManager.data)
        this.pause()
    }

    update(delta: number) {
        if (!this.paused.value) this.world.update(delta)
    }

    createBounds(world: World): void {
        // floor
        this.setBounds(wall, this.appDimensions.x / 2, this.appDimensions.y - (this.wallThickness / 2), this.appDimensions.x, this.wallThickness)
        world.addEntity(CreateEntity(wall, world))
        // leftWall
        this.setBounds(wall, this.wallThickness / 2, (this.appDimensions.y / 2), this.wallThickness, this.appDimensions.y - (this.wallThickness * 2))
        world.addEntity(CreateEntity(wall, world))
        // rightWall
        this.setBounds(wall, this.appDimensions.x - (this.wallThickness / 2), (this.appDimensions.y / 2), this.wallThickness, this.appDimensions.y - (this.wallThickness * 2))
        world.addEntity(CreateEntity(wall, world))
        // ceiling
        this.setBounds(wall, this.appDimensions.x / 2, this.wallThickness / 2, this.appDimensions.x, this.wallThickness)
        world.addEntity(CreateEntity(wall, world))
    }
    setBounds(entity: EntityMap, positionX: number, positionY: number, sizeX: number, sizeY: number): void {
        const { position, size } = entity.options
        position.x = positionX
        position.y = positionY
        size.x = sizeX
        size.y = sizeY
    }

}
