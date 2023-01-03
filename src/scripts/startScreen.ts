import useScreen from "../composeables/useScreen";
import * as PIXI from 'pixi.js'
import { createGrid, mapScreen } from "./mapScreen";

export const startScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });

const PressStart2P = new FontFace(
    "PixiPressStart2P",
    "url('./assets/fonts/PressStart2P-Regular.ttf')"
);
PressStart2P.load().then(function (font) {
    // with canvas, if this is ommited won't work
    document.fonts.add(font)
    console.log('font loaded')

    const style = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 16,
        fill: ['#4ade80'],
    });
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
    startScreen.stage.on('click', (event) => {
        //handle event
        useScreen(mapScreen)
        createGrid()
    });
});
