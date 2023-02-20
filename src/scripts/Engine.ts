import * as PIXI from "pixi.js"
import { Entity } from "./entities/entity"
import { GraphicsComponent, PositionComponent, SizeComponent } from "./components/components"

export class Engine {
    private readonly app: PIXI.Application
    player: Entity

    constructor(elementRef: any) {
        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)
        })

        // demo
        this.player = new Entity('player')

    }
    playerEntityTest() {
        this.player.addComponent(new PositionComponent())
        console.log('player has postion ' + this.player.hasComponent('position')) // true
        console.log('player has velocity ' + this.player.hasComponent('velocity')) // false
        const playerPosition = this.player.getComponent('position') as PositionComponent
        playerPosition.x = 10
        playerPosition.y = 10
        this.player.addComponent(new SizeComponent(10))
        const playerSize = this.player.getComponent('size') as SizeComponent

        this.player.addComponent(new GraphicsComponent(playerPosition, playerSize))
        console.dir(this.player)
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

        this.playerEntityTest()

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
