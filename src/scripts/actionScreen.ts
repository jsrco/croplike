import * as PIXI from 'pixi.js'
import { GameScreen } from "./gameScreen"
import { clickedObject, createGrid, mapScreen } from "./mapScreen"
import useScreen from "../composeables/useScreen"

PIXI.settings.SCALE_MODE = 0

export const actionScreen: GameScreen = new GameScreen({ appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'actionScreen' })

const style = new PIXI.TextStyle({
    fontFamily: 'PixiPressStart2P',
    fontSize: 16,
    fill: ['#fff'],
})

const square = new PIXI.Graphics()
const squareDimension = 15
class Entity {
    drag: number
    gravity: number
    jumpSpeed: number
    vx: number
    vy: number
    constructor() {
        this.drag = 0.95;
        this.gravity = 0.5
        this.jumpSpeed = 10
        this.vx = 0
        this.vy = 0
    }
    moveLeft() {
        this.vx = -5
    }
    moveRight() {
        this.vx = 5
    }
    jump() {
        if (square.y === window.innerHeight - 36 - squareDimension) {
            this.vy = -this.jumpSpeed
        }
    }
    update() {
        square.x += this.vx
        square.y += this.vy
        this.vy += this.gravity
        if (square.y > window.innerHeight - 36 - squareDimension) {
            square.y = window.innerHeight - 36 - squareDimension
            this.vy = 0
        }
        if (square.x < 0) {
            square.x = 0
            this.vx = 0
        } else if (square.x + squareDimension > window.innerWidth) {
            square.x = window.innerWidth - squareDimension
            this.vx = 0
        }
        this.vx *= this.drag
    }
}


const player = new Entity()

const onKeyDown = (key: { keyCode: number }) => {
    if (useScreen().Screen.value?.stageName === 'actionScreen') {
        // A Key is 65
        // Left arrow is 37
        if (key.keyCode === 65 || key.keyCode === 37) {
            // If the A key or the Left arrow is pressed, move the player to the left.
            player.moveLeft()
        }
        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            player.moveRight()
        }
        if (key.keyCode === 87 || key.keyCode === 38) {
            // If the W key or the Up arrow is pressed, move the player up.
            player.jump()
        }
    }
}
document.addEventListener('keydown', onKeyDown)
export const createAction = () => {
    actionScreen.stage.removeChildren()

    const richText = new PIXI.Text('action screen', style);
    richText.x = 10
    richText.y = 10
    actionScreen.stage.addChild(richText)
    const poorText = new PIXI.Text(`Grid: ${clickedObject.value.shapeNumber}\nPosition: ${clickedObject.value.position}\nType:${clickedObject.value.type}`, style);
    poorText.x = 10
    poorText.y = 30
    actionScreen.stage.addChild(poorText)

    actionScreen.stage.interactive = true;
    actionScreen.stage.hitArea = actionScreen.screen;
    actionScreen.stage.on('pointerup', (event) => {
        //handle event
        useScreen(mapScreen)
        mapScreen.render()
        requestAnimationFrame(createGrid)
    })

    square.beginFill(0xff0000)
    square.drawRect(0, 0, squareDimension, squareDimension)
    square.endFill()
    square.x = 0
    square.y = window.innerHeight - squareDimension - 36
    actionScreen.stage.addChild(square)

    actionScreen.ticker.add((delta) => {
        player.update()
    })
    actionScreen.render()
}
