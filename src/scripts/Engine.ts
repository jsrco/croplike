import * as PIXI from "pixi.js"
import { Entity } from "./entities/Entity"
import { CollisionComponent, GraphicsComponent, GravityComponent, JumpComponent, PositionComponent, SizeComponent, VelocityComponent, WallCollisionComponent, WallComponent } from "./components/index"
import { CollisionSystem, GravitySystem, MovementSystem, RenderSystem } from "./systems/index"
import { World } from "./util/World"

export class Engine {
    app: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
    block: Entity
    blockLeft: Entity
    blockRight: Entity
    platform: Entity
    player: Entity
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#4ade80'],
    })
    textSupport: PIXI.Text = dummyText('a start screen', this.textStyle)
    world: World = new World(this.app)
    constructor(elementRef: any) {
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)

            //temp 
            const positionSet = this.block.getComponent('position') as PositionComponent
            const sizeSet = this.block.getComponent('size') as SizeComponent
            sizeSet.setSize(this.app.renderer.width - 40, 20)
            positionSet.setPosition(20, this.app.renderer.height - sizeSet.height)

            const positionSetbl = this.blockLeft.getComponent('position') as PositionComponent
            const sizeSetbl = this.blockLeft.getComponent('size') as SizeComponent
            sizeSetbl.setSize(20, this.app.renderer.height)
            positionSetbl.setPosition(0, 0)

            const positionSetbr = this.blockRight.getComponent('position') as PositionComponent
            const sizeSetbr = this.blockRight.getComponent('size') as SizeComponent
            sizeSetbr.setSize(20, this.app.renderer.height)
            positionSetbr.setPosition(this.app.renderer.width - sizeSetbr.width, 0)
        })
        // demo
        this.player = new Entity('player')
        this.createEntity(this.player)
        this.world.addEntity(this.player)
        const position = this.player.getComponent('position') as PositionComponent
        position.setPosition(30, 30)

        // demo
        this.platform = new Entity('platform')
        this.createEntity(this.platform)
        this.world.addEntity(this.platform)
        const platformposition = this.platform.getComponent('position') as PositionComponent
        platformposition.setPosition(200, 300)

        // dummy level
        this.block = new Entity('block')
        this.createEntity(this.block)
        this.blockLeft = new Entity('block')
        this.createEntity(this.blockLeft)
        this.blockRight = new Entity('block')
        this.createEntity(this.blockRight)

        this.world.addEntity(this.block)
        this.world.addEntity(this.blockLeft)
        this.world.addEntity(this.blockRight)

        const positionSet = this.block.getComponent('position') as PositionComponent
        const sizeSet = this.block.getComponent('size') as SizeComponent
        sizeSet.setSize(this.app.renderer.width - 40, 20)
        positionSet.setPosition(20, this.app.renderer.height - sizeSet.height)

        const positionSetbl = this.blockLeft.getComponent('position') as PositionComponent
        const sizeSetbl = this.blockLeft.getComponent('size') as SizeComponent
        sizeSetbl.setSize(20, this.app.renderer.height)
        positionSetbl.setPosition(0, 0)

        const positionSetbr = this.blockRight.getComponent('position') as PositionComponent
        const sizeSetbr = this.blockRight.getComponent('size') as SizeComponent
        sizeSetbr.setSize(20, this.app.renderer.height)
        positionSetbr.setPosition(this.app.renderer.width - sizeSetbr.width, 0)

        const gravityPlatform = this.platform.getComponent('gravity') as GravityComponent
        gravityPlatform.setGravity(.3)
        const sizeSetplatform = this.platform.getComponent('size') as SizeComponent
        sizeSetplatform.setSize(190)

        this.world.addSystem(new CollisionSystem(this.world))
        this.world.addSystem(new GravitySystem(this.world))
        this.world.addSystem(new MovementSystem(this.world))
        this.world.addSystem(new RenderSystem(this.world))
    }
    createEntity(entity: Entity) {
        entity.addComponents([new CollisionComponent(this.world), new PositionComponent(this.world), new SizeComponent(this.world, 10), new VelocityComponent(this.world)])
        if (entity.name === 'player' || entity.name === 'platform') {
            entity.addComponent(new GravityComponent(this.world))
            entity.addComponent(new GraphicsComponent(this.world, 0xFFFFFF))
            entity.addComponent(new JumpComponent(this.world))
            entity.addComponent(new WallCollisionComponent(this.world))
        } else entity.addComponents([new GraphicsComponent(this.world, 0x4ade80), new WallComponent(this.world)])
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
        this.textSupport.x = 10
        this.textSupport.y = 10
        this.app.stage.addChild(this.textSupport)

        this.world.update(delta)
    }
}


function dummyText(text: string, style: PIXI.TextStyle) {
    return new PIXI.Text(text, style)
}
