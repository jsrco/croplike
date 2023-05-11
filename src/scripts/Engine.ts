import * as PIXI from "pixi.js"
import { World } from "./util/World"
import { ceiling, floor, largeEntity, leftWall, player, rightWall } from "./entities/templates"
import { CreateEntity, EntityMap } from "./entities/Create"
import { Entity } from "./entities/Entity"
import { PositionComponent, SizeComponent } from "./components"
import { CollisionSystem, GravitySystem, MovementSystem, OutOfBoundsSystem, RenderSystem, SizeSystem } from "./systems"
import { LocalStorageManager } from "./util/LocalStorageManager"
import { SaveManager } from "./util/SaveManager"

export class Engine {
    app: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    paused: boolean = false
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#4ade80'],
    })
    world: World = new World(this.app)

    textSupport: PIXI.Text = dummyText('a start screen', this.textStyle)
    wallSize: number = 35

    constructor(elementRef: any) {
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)
            this.resetAllBounds()
        })
        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
              this.pause()
            }
        })

        // set app
        this.app.stage.eventMode = 'static'
        this.app.stage.hitArea = this.app.screen
        this.app.stage.on('pointerup', (event) => {
            //handle event
            console.dir('clicky clicky')
        })
        this.app.ticker.add((delta) => {
            this.update(delta)
        })

        // load entities
        this.loadEntities(this.world)

        // load systems
        this.loadSystems(this.world)
    }
    load(): void {
        this.paused = true  
        this.app.renderer.clear()  
        this.app.stage.removeChildren()

        const saveData: any = this.localStorageManager.getData()
        this.world = new World(this.app)
        saveData.entities.forEach((entity: EntityMap) => {
            this.saveManager.loadEntity(entity, this.world)
        })
        this.loadSystems(this.world)
    }
    loadEntities(world:World): void {
        world.addEntity(CreateEntity(player, world))
        world.addEntity(CreateEntity(largeEntity, world))
        // dummy level
        this.createBounds(world)
    }
    loadSystems(world: World):void {
        world.addSystem(new CollisionSystem(world))
        world.addSystem(new GravitySystem(world))
        world.addSystem(new MovementSystem(world))
        world.addSystem(new OutOfBoundsSystem(world))
        world.addSystem(new RenderSystem(world))
        world.addSystem(new SizeSystem(world))
    }
    pause(): void {
        this.paused = !this.paused
        console.log('pause', this.paused)
        if (this.paused) this.pauseTicker()
        else this.resumeTicker()
    }
    pauseTicker(): void {
        this.app.ticker.stop()
    }
    resumeTicker(): void {
        this.app.ticker.start()
    }
    save(): void {    
        this.paused = true  
        this.localStorageManager.clearData()
        this.saveManager.createAllEntityData(this.world)
        this.localStorageManager.saveData(this.saveManager.data)
        this.paused = false
    }
    update(delta: number): void {
        // update game logic
        this.app.stage.removeChild(this.textSupport)
        this.textSupport = dummyText(`a start screen ${this.app.renderer.width} x ${this.app.renderer.height}`, this.textStyle)
        this.textSupport.x = this.wallSize + 5
        this.textSupport.y = this.wallSize + 5
        this.app.stage.addChild(this.textSupport)

        if (!this.paused) this.world.update(delta)
    }
    // demo wall
    createBounds(world: World): void {
        world.addEntity(CreateEntity({ ...ceiling, options: { graphics: { color: 0x4ade80 }, position: { x: this.wallSize, y: 0 }, size: { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 } } }, world))
        world.addEntity(CreateEntity({ ...floor, options: { graphics: { color: 0x4ade80 }, position: { x: this.wallSize, y: this.app.renderer.height - this.wallSize }, size: { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 } } }, this.world))
        world.addEntity(CreateEntity({ ...leftWall, options: { graphics: { color: 0x4ade80 }, position: { x: 0, y: 0 }, size: { height: this.app.renderer.height, width: this.wallSize } } }, world))
        world.addEntity(CreateEntity({ ...rightWall, options: { graphics: { color: 0x4ade80 }, position: { x: this.app.renderer.width - this.wallSize, y: 0 }, size: { height: this.app.renderer.height, width: this.wallSize } } }, world))
    }
    resetBounds(entity: Entity, pos: { x: number, y: number }, dimension: { height: number, width: number }): void {
        const position = entity.getComponent('position') as PositionComponent
        const { x, y } = pos
        position.setPosition(x, y)
        const size = entity.getComponent('size') as SizeComponent
        const { width, height } = dimension
        size.setSize(width, height)
    }
    resetAllBounds(): void {
        const walls = this.world.getEntitiesByComponent('wall')
        console.log(walls)
        walls.forEach(wall => {
            if (wall.name === 'ceiling') this.resetBounds(wall, { x: this.wallSize, y: 0 }, { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 })
            if (wall.name === 'floor') this.resetBounds(wall, { x: this.wallSize, y: this.app.renderer.height - this.wallSize }, { height: this.wallSize, width: this.app.renderer.width - this.wallSize * 2 })
            if (wall.name === 'leftWall') this.resetBounds(wall, { x: 0, y: 0 }, { height: this.app.renderer.height, width: this.wallSize })
            if (wall.name === 'rightWall') this.resetBounds(wall, { x: this.app.renderer.width - this.wallSize, y: 0 }, { height: this.app.renderer.height, width: this.wallSize })
        })
    }
}

function dummyText(text: string, style: PIXI.TextStyle) {
    return new PIXI.Text(text, style)
}
