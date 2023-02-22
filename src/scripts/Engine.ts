import * as PIXI from "pixi.js"
import { Entity } from "./entities/Entity"
import { GraphicsComponent, PositionComponent, SizeComponent, VelocityComponent } from "./components/index"
import { MovementSystem } from "./systems/index"
import { World } from "./util/World"

export class Engine {
    app: PIXI.Application
    player: Entity
    world: World = new World()
    constructor(elementRef: any) {
        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)
        })
        // demo
        this.player = new Entity('player')
        this.createPlayer()
        this.world.addEntity(this.player)
        this.world.addSystem(new MovementSystem(this.world))

    }
    createPlayer() {
        this.player.addComponents([new PositionComponent(this.world), new SizeComponent(this.world, 10), new VelocityComponent(this.world)])
        const playerPosition = this.player.getComponent('position') as PositionComponent
        const playerSize = this.player.getComponent('size') as SizeComponent
        this.player.addComponent(new GraphicsComponent(this.world, playerPosition, playerSize))
    }
    public start(): void {
        const richText = dummyText('a start screen')
        richText.x = 10
        richText.y = 10
        this.app.stage.addChild(richText)
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
        this.app.stage.removeChildren()
        const richText = dummyText(`a start screen ${this.app.renderer.width} x ${this.app.renderer.height}`)
        richText.x = 10
        richText.y = 10
        this.app.stage.addChild(richText)
        this.world.update(delta)
        const playerGraphic = this.player.getComponent('graphics') as GraphicsComponent
        this.app.stage.addChild(playerGraphic.rectangle)
    }
}


function dummyText(text: string) {
    const style = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#4ade80'],
    })
    return new PIXI.Text(text, style)
}
