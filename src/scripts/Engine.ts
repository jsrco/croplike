import * as PIXI from "pixi.js"
import { Entity } from "./entities/Entity"
import { GraphicsComponent, GravityComponent, PositionComponent, SizeComponent, VelocityComponent } from "./components/index"
import { GravitySystem, MovementSystem, RenderSystem } from "./systems/index"
import { World } from "./util/World"

export class Engine {
    app: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
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
        })
        // demo
        this.player = new Entity('player')
        this.createPlayer()
        this.world.addEntity(this.player)
        this.world.addSystem(new GravitySystem(this.world))
        this.world.addSystem(new MovementSystem(this.world))
        this.world.addSystem(new RenderSystem(this.world))
    }
    createPlayer() {
        this.player.addComponents([new GravityComponent(this.world), new PositionComponent(this.world), new SizeComponent(this.world, 10), new VelocityComponent(this.world)])
        this.player.addComponent(new GraphicsComponent(this.world))

        const positionComponent = this.player.getComponent('position') as PositionComponent
        positionComponent.setPosition(positionComponent.x, positionComponent.y + 40)
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
