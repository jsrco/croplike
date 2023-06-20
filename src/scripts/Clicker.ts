
import { Ref, ref } from "vue"
import * as PIXI from "pixi.js"
import { World } from "./util/World"
import { ceiling, floor, largeEntity, leftWall, player, rightWall } from "./entities/templates"
import { CreateEntity, EntityMap } from "./entities/Create"
import { Entity } from "./entities/Entity"
import { CameraSystem, CollisionSystem, GravitySystem, MovementSystem, OutOfBoundsSystem, RenderSystem, SizeSystem } from "./systems"
import { LocalStorageManager } from "./util/LocalStorageManager"
import { SaveManager } from "./util/SaveManager"
import { smolScreen } from "./util/Tools"

export class Clicker {
    name: String = 'clicker'

    app: PIXI.Application = new PIXI.Application({ backgroundColor: 0x1d1d1d, width: 2000, height: 1500 })
    localStorageManager = new LocalStorageManager('croplike-v0-game-data')
    paused: Ref<Boolean> = ref(false)
    saveManager: SaveManager = new SaveManager()
    textStyle: PIXI.TextStyle = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#ffffff'],
    })
    world: World = new World(this.app)


    textSupport: PIXI.Text = dummyText('a start screen', this.textStyle)

    constructor() {
        window.addEventListener('resize', () => {
            console.log('resized')
        })

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.pause()
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
    }
    appendElement(elementRef: any): void {
        elementRef.appendChild(this.app.view)
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
    update(delta: number): void {
       // this.app.stage.removeChild(this.textSupport)
        this.textSupport = dummyText(`app size ${this.app.renderer.width} x ${this.app.renderer.height}`, this.textStyle)
        this.textSupport.x = 5
        this.textSupport.y = 5
        this.app.stage.addChild(this.textSupport)

        if (!this.paused.value) this.world.update(delta)
    }
  }

function dummyText(text: string, style: PIXI.TextStyle) {
    return new PIXI.Text(text, style)
}
