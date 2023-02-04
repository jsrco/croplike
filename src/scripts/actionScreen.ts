import * as PIXI from 'pixi.js'
import { GameScreen } from "./gameScreen"
import { clickedObject, createGrid, mapScreen } from "./mapScreen"
import useScreen from "../composeables/useScreen"
import { ref } from 'vue'

PIXI.settings.SCALE_MODE = 0

export const actionScreen: GameScreen = new GameScreen({ appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'actionScreen' })

const style = new PIXI.TextStyle({
    fontFamily: 'PixiPressStart2P',
    fontSize: 16,
    fill: ['#fff'],
})

const square = new PIXI.Graphics()
const squareDimension = 15
const vX = ref(0)
const onKeyDown = (key: { keyCode: number }) => {
    if (useScreen().Screen.value?.stageName === 'actionScreen') {
        // A Key is 65
        // Left arrow is 37
        if (key.keyCode === 65 || key.keyCode === 37) {
            // If the A key or the Left arrow is pressed, move the player to the left.
            if (square.position.x >= 0) {
                if (vX.value > 0) {
                    vX.value = 0
                }
                if (vX.value > -5) vX.value--
                // Don't move to the left if the player is at the left side of the stage
                square.position.x += vX.value
            }
        }
        // D Key is 68
        // Right arrow is 39
        if (key.keyCode === 68 || key.keyCode === 39) {
            // If the D key or the Right arrow is pressed, move the player to the right.
            if (square.position.x < window.innerWidth - squareDimension) {
                if (vX.value < 0) {
                    vX.value = 0
                }
                if (vX.value < 5) vX.value++
                // Don't move to the right if the player is at the right side of the stage
                square.position.x += vX.value
            }
        }
    }
}
const onKeyUp = (key: { keyCode: number }) => {
    if (useScreen().Screen.value?.stageName === 'actionScreen') {
        vX.value = 0
    }
}
document.addEventListener('keydown', onKeyDown)
document.addEventListener('keyup', onKeyUp)
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

    const update = () => {
        actionScreen.render()
        requestAnimationFrame(update)
    }
    update()
}
