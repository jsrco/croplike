import * as PIXI from "pixi.js"
import { World } from "./util/World"
import { ceiling, floor, largeEntity, leftWall, player, rightWall } from "./entities/templates"
import { CreateEntity } from "./entities/Create"
import { Entity } from "./entities/Entity"
import { PositionComponent, SizeComponent } from "./components"
import { CollisionSystem, GravitySystem, MovementSystem, OutOfBoundsSystem, RenderSystem } from "./systems"

export class Engine {
    app: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
    largeEntity: Entity
    player: Entity
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#4ade80'],
    })
    textSupport: PIXI.Text = dummyText('a start screen', this.textStyle)
    world: World = new World(this.app)

    cieling: Entity
    floor: Entity
    leftWall: Entity
    rightWall: Entity

    constructor(elementRef: any) {
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)
            this.resetBounds(this.cieling, { x: 21, y: 0 }, { height: 20, width: this.app.renderer.width - 40 })
            this.resetBounds(this.floor, { x: 20, y: this.app.renderer.height - 20 }, { height: 20, width: this.app.renderer.width - 40 })
            this.resetBounds(this.leftWall, { x: 0, y: 0 }, { height: this.app.renderer.height, width: 20 })
            this.resetBounds(this.rightWall, { x: this.app.renderer.width - 20, y: 0 }, { height: this.app.renderer.height, width: 20 })
        })
        this.player = CreateEntity(player, this.world)
        this.world.addEntity(this.player)
        this.largeEntity = CreateEntity(largeEntity, this.world)
        this.world.addEntity(this.largeEntity)

        // dummy level
        this.cieling = CreateEntity({ ...ceiling, options: { graphics: { color: 0x4ade80 }, position: { x: 21, y: 0 }, size: { height: 20, width: this.app.renderer.width - 40 } } }, this.world)
        this.world.addEntity(this.cieling)
        this.floor = CreateEntity({ ...floor, options: { graphics: { color: 0x4ade80 }, position: { x: 20, y: this.app.renderer.height - 20 }, size: { height: 20, width: this.app.renderer.width - 40 } } }, this.world)
        this.world.addEntity(this.floor)
        this.leftWall = CreateEntity({ ...leftWall, options: { graphics: { color: 0x4ade80 }, position: { x: 0, y: 0 }, size: { height: this.app.renderer.height, width: 20 } } }, this.world)
        this.world.addEntity(this.leftWall)
        this.rightWall = CreateEntity({ ...rightWall, options: { graphics: { color: 0x4ade80 }, position: { x: this.app.renderer.width - 20, y: 0 }, size: { height: this.app.renderer.height, width: 20 } } }, this.world)
        this.world.addEntity(this.rightWall)

        this.world.addSystem(new CollisionSystem(this.world))
        this.world.addSystem(new GravitySystem(this.world))
        this.world.addSystem(new MovementSystem(this.world))
        this.world.addSystem(new OutOfBoundsSystem(this.world))
        this.world.addSystem(new RenderSystem(this.world))
    }
    public start(): void {
        this.app.stage.eventMode = 'static'
        this.app.stage.hitArea = this.app.screen
        this.app.stage.on('pointerup', (event) => {
            //handle event
            console.dir('clicky clicky')
        })
        this.app.ticker.add((delta) => {
            this.update(delta)
        })
    }
    private update(delta: number): void {
        // update game logic
        this.app.stage.removeChild(this.textSupport)
        this.textSupport = dummyText(`a start screen ${this.app.renderer.width} x ${this.app.renderer.height}`, this.textStyle)
        this.textSupport.x = 30
        this.textSupport.y = 30
        this.app.stage.addChild(this.textSupport)

        this.world.update(delta)
    }
    resetBounds(entity: Entity, pos: { x: number, y: number }, dimension: { height: number, width: number }): void {
        const position = entity.getComponent('position') as PositionComponent
        const { x, y } = pos
        position.setPosition(x, y)
        const size = entity.getComponent('size') as SizeComponent
        const { width, height } = dimension
        size.setSize(width, height)
    }
}

function dummyText(text: string, style: PIXI.TextStyle) {
    return new PIXI.Text(text, style)
}
