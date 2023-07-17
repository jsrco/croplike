
import * as PIXI from "pixi.js"
import { Ref, ref } from "vue"
import { World } from "../util/World"
import { CreateEntity, EntityMap } from "./entities/Create"
import { Entity } from "./entities/Entity"
import { ceiling, floor, largeEntity, leftWall, player, rightWall } from "./entities/templates"
import { CameraSystem, CollisionSystem, GravitySystem, MovementSystem, OutOfBoundsSystem, RenderSystem, SizeSystem } from "./systems"
import { LocalStorageManager } from "./util/LocalStorageManager"
import { SaveManager } from "./util/SaveManager"
import { smolScreen } from "./util/Tools"

export class Engine {
    name: String = 'Croplike'

    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: 2000, height: 1500 })
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    paused: Ref<Boolean> = ref(false)
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#000000'],
    })
    world: World = new World(this.app)

    player: Entity = CreateEntity(player, this.world)
    playerJ: boolean = false
    playerL: boolean = false
    playerR: boolean = false

    moveLeftButton?: PIXI.Graphics
    moveRightButton?: PIXI.Graphics
    jumpButton?: PIXI.Graphics

    textSupport: PIXI.Text = dummyText('a start screen', this.textStyle)
    wallSize: number = 60

    constructor() {
        window.addEventListener('resize', () => {
            if (smolScreen()) {
                this.app.stage.removeChild(this.moveLeftButton as PIXI.Graphics)
                this.app.stage.removeChild(this.moveRightButton as PIXI.Graphics)
                this.app.stage.removeChild(this.jumpButton as PIXI.Graphics)
                this.createControls()
            }
        })

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

        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                if (this.paused.value === false) this.pause()
            }
        })

        window.addEventListener('blur', () => {
            if (this.paused.value === false) this.pause()
        })

        // set app
        this.app.stage.eventMode = 'static'
        // this.app.stage.hitArea = this.app.screen
        // this.app.stage.on('pointerup', (event) => {
        //     //handle event
        //     console.dir('clicky clicky')
        // })
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        // load entities
        this.loadEntities(this.world)

        // load systems
        this.loadSystems(this.world)

        this.pause()

        if (smolScreen()) {
            this.createControls()
        }
    }
    appendElement(elementRef: any): void {
        elementRef.appendChild(this.app.view)
    }
    load(): void {
        this.paused.value = true
        this.app.stage.removeChildren()

        const saveData: any = this.localStorageManager.getData()
        this.world = new World(this.app)
        saveData.entities.forEach((entity: EntityMap) => {
            this.saveManager.loadEntity(entity, this.world, this)
        })
        this.loadSystems(this.world)
        if (smolScreen()) {
            this.createControls()
        }
        this.pause()
    }
    loadEntities(world: World): void {
        world.addEntity(this.player)
        world.addEntity(CreateEntity(largeEntity, world))
        // dummy level
        this.createBounds(world)
    }
    loadSystems(world: World): void {
        world.addSystem(new CameraSystem(world, this.player))
        world.addSystem(new CollisionSystem(world, this))
        world.addSystem(new GravitySystem(world))
        world.addSystem(new MovementSystem(world, this))
        world.addSystem(new OutOfBoundsSystem(world))
        world.addSystem(new RenderSystem(world))
        world.addSystem(new SizeSystem(world))
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
    update(delta: number): void {
        if (!this.paused.value) this.world.update(delta)
    }
    // demo controls
    createControls() {
        this.moveLeftButton = new PIXI.Graphics()
        this.moveLeftButton.lineStyle(0) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.moveLeftButton.beginFill(0xFBBF5D, .5)
        this.moveLeftButton.drawCircle(25, window.innerHeight - 36 - 30, 25)
        this.moveLeftButton.endFill()
        this.app.stage.addChild(this.moveLeftButton)
        this.moveLeftButton.eventMode = "dynamic"
        this.moveLeftButton.on('pointerdown', () => this.playerMoveLeft())
            .on('pointerup', () => this.resetMovement())

        this.moveRightButton = new PIXI.Graphics()
        this.moveRightButton.lineStyle(0) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.moveRightButton.beginFill(0xFBBF5D, .5)
        this.moveRightButton.drawCircle(75, window.innerHeight - 36 - 30, 25)
        this.moveRightButton.endFill()
        this.app.stage.addChild(this.moveRightButton)
        this.moveRightButton.eventMode = 'dynamic'
        this.moveRightButton.on('pointerdown', () => this.playerMoveRight())
            .on('pointerup', () => this.resetMovement())

        this.jumpButton = new PIXI.Graphics()
        this.jumpButton.lineStyle(0) // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        this.jumpButton.beginFill(0xFBBF5D, .5)
        this.jumpButton.drawCircle(window.innerWidth - 30, window.innerHeight - 36 - 30, 25)
        this.jumpButton.endFill()
        this.app.stage.addChild(this.jumpButton)
        this.jumpButton.eventMode = 'dynamic'
        this.jumpButton.on('pointerdown', () => this.playerMoveJump())
            .on('pointerup', () => this.resetMovement())
    }
    playerMoveJump() {
        this.playerJ = true
    }
    playerMoveLeft() {
        this.playerL = true
    }
    playerMoveRight() {
        this.playerR = true
    }
    resetMovement() {
        this.playerJ = false
        this.playerL = false
        this.playerR = false
    }
    // demo wall
    createBounds(world: World): void {
        world.addEntity(CreateEntity({ ...ceiling, options: { graphics: { color: 0x60A5FA }, position: { x: this.wallSize, y: 0 }, size: { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 } } }, world))
        world.addEntity(CreateEntity({ ...floor, options: { graphics: { color: 0x60A5FA }, position: { x: this.wallSize, y: this.app.renderer.height - this.wallSize }, size: { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 } } }, this.world))
        world.addEntity(CreateEntity({ ...leftWall, options: { graphics: { color: 0x60A5FA }, position: { x: 0, y: 0 }, size: { height: this.app.renderer.height, width: this.wallSize } } }, world))
        world.addEntity(CreateEntity({ ...rightWall, options: { graphics: { color: 0x60A5FA }, position: { x: this.app.renderer.width - this.wallSize, y: 0 }, size: { height: this.app.renderer.height, width: this.wallSize } } }, world))
    }
}

function dummyText(text: string, style: PIXI.TextStyle) {
    return new PIXI.Text(text, style)
}