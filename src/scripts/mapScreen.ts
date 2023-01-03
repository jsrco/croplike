import useScreen from "../composeables/useScreen";
import * as PIXI from 'pixi.js'
import { startScreen } from "./startScreen"
import { ref } from "vue";

const { Screen, ScreenHeight, ScreenWidth } = useScreen()
export const mapScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });
mapScreen.specialStagename = 'mapScreen'
const createGridPiece = (pX: number, pY: number, size: number) => {
    const graphics = new PIXI.Graphics();
    const curve = 2
    graphics.lineStyle(2, 0xFEF2F2, 1);
    graphics.beginFill(0xFCA5A5, 0.25);
    graphics.drawRoundedRect(pX, pY, size, size, curve);
    graphics.endFill();
    graphics.interactive = true
    graphics.hitArea = new PIXI.RoundedRectangle(pX, pY, size, size, curve)
    graphics.on('click', (event) => {
        //handle event
        Screen.value.stage.removeChildren()
        useScreen(startScreen)
    });
    graphics.on('mouseout', (event) => {
        //handle event
        graphics.clear()
        graphics.lineStyle(2, 0xFEF2F2, 1);
        graphics.beginFill(0xFCA5A5, 0.25);
        graphics.drawRoundedRect(pX, pY, size, size, curve);
        graphics.endFill();
    });
    graphics.on('mouseover', (event) => {
        //handle event
        graphics.clear()
        graphics.lineStyle(2, 0xFEF2F2, 1);
        graphics.beginFill(0xFEF2F2, 0.50);
        graphics.drawRoundedRect(pX, pY, size, size, curve);
        graphics.endFill();
    })
    mapScreen.stage.addChild(graphics)
}

export const createGrid = () => {
    const gridSize = 32
    const seperator = gridSize + 3
    for (let xStarter = 5; xStarter < ScreenWidth.value - seperator - 5; xStarter += seperator) {
        let yStarter = 5
        for (yStarter; yStarter < ScreenHeight.value - seperator - 5; yStarter += seperator) {
            createGridPiece(xStarter, yStarter, gridSize)
        }
    }
}

window.addEventListener('resize', () => {
    if (Screen.value.specialStagename === 'mapScreen') {
        Screen.value.stage.removeChildren()
        createGrid()
    }
})