import * as PIXI from "pixi.js"

export class Engine {
    private readonly app: PIXI.Application

    constructor(elementRef: any) {
        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
        elementRef.appendChild(this.app.view)
        window.addEventListener('resize', () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight - 36)
        })
    }
    public start(): void {

        const style = new PIXI.TextStyle({
            fontFamily: 'PixiPressStart2P',
            fontSize: 8,
            fill: ['#4ade80'],
        })
        const richText = new PIXI.Text('a start screen', style)
        richText.x = 10
        richText.y = 10
        this.app.stage.addChild(richText)

        this.app.stage.interactive = true
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

    }
}