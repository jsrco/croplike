import useScreen from "../composeables/useScreen";
import * as PIXI from 'pixi.js'
import { startScreen } from "./startScreen"


export const mapScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });
const graphics = new PIXI.Graphics();
mapScreen.stage.addChild(graphics)

const createGridPiece = (pX: number, pY:number, size: number) => { 
    const curve = 2
    graphics.lineStyle(2, 0xFF00FF, 1);
    graphics.beginFill(0x650A5A, 0.25);
    graphics.drawRoundedRect(pX, pY, size, size, curve);
    graphics.endFill();
    graphics.interactive = true
    graphics.hitArea = new PIXI.RoundedRectangle(pX, pY, size, size, curve)
    graphics.on('click', (event) => {
        //handle event
        useScreen(startScreen)
    });
    graphics.on('mouseout', (event) => {
        //handle event
        graphics.clear()
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0x650A5A, 0.25);
        graphics.drawRoundedRect(pX, pY, size, size, curve);
        graphics.endFill();
    });
    graphics.on('mouseover', (event) => {
        //handle event
        graphics.clear()
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0x650A5A, 0.50);
        graphics.drawRoundedRect(pX, pY, size, size, curve);
        graphics.endFill();
    })
}

createGridPiece(5,5,52)
