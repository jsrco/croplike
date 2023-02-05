import * as PIXI from 'pixi.js'
import { GameScreen } from "./gameScreen"
import { createGrid, mapScreen } from "./mapScreen"
import useScreen from "../composeables/useScreen"
import useStorage from '../composeables/useStorage'

PIXI.settings.SCALE_MODE = 0

export const startScreen: GameScreen = new GameScreen({ appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'startScreen' })

const PressStart2P = new FontFace(
    "PixiPressStart2P",
    "url('./assets/fonts/PressStart2P-Regular.ttf')"
)
PressStart2P.load().then(function (font) {
    // with canvas, if this is ommited won't work
    document.fonts.add(font)

    const style = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 8,
        fill: ['#4ade80'],
    })
    const richText = new PIXI.Text('a start screen', style);
    richText.x = 10
    richText.y = 10
    startScreen.stage.addChild(richText)
    const poorText = new PIXI.Text('click to go to map demo', style);
    poorText.x = 10
    poorText.y = 30
    startScreen.stage.addChild(poorText)

    startScreen.stage.interactive = true;
    startScreen.stage.hitArea = startScreen.screen;
    startScreen.stage.on('pointerup', (event) => {
        //handle event
        const { checkIfSynched, isOutOfSynch } = useStorage()
        checkIfSynched()
        if (isOutOfSynch.value) {
            throw Error('data out of synch')
        } else {
            useScreen(mapScreen)
            mapScreen.render()
            requestAnimationFrame(createGrid)
        }
    })
})
