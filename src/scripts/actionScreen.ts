import useScreen from "../composeables/useScreen"
import * as PIXI from 'pixi.js'
import { GameScreen } from "./gameScreen"
import { clickedObject, createGrid, mapScreen } from "./mapScreen"

PIXI.settings.SCALE_MODE = 0

export const actionScreen: GameScreen = new GameScreen({ appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'actionScreen' })

const style = new PIXI.TextStyle({
    fontFamily: 'PixiPressStart2P',
    fontSize: 16,
    fill: ['#fff'],
})

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
}