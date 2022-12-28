import useScreen from "../composeables/useScreen";
import * as PIXI from 'pixi.js'

export const startScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });

const style = new PIXI.TextStyle({
    fontFamily: 'PressStart2p',
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
});

const mapScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, });
const graphics = new PIXI.Graphics();
graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0x650A5A, 0.25);
graphics.drawRoundedRect(10, 10, 21, 21, 2);
graphics.endFill();
graphics.interactive = true
graphics.hitArea = new PIXI.RoundedRectangle(10, 10, 21, 21, 2)
mapScreen.stage.addChild(graphics)
graphics.on('click', (event) => {
   //handle event
    useScreen(startScreen)
});
graphics.on('mouseout', (event) => {
   //handle event
   graphics.clear()
   graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0x650A5A, 0.25);
graphics.drawRoundedRect(10, 10, 21, 21, 2);
graphics.endFill();
});
graphics.on('mouseover', (event) => {
   //handle event
   graphics.clear()
   graphics.lineStyle(2, 0xFF00FF, 1);
graphics.beginFill(0x650A5A, 0.50);
graphics.drawRoundedRect(10, 10, 21, 21, 2);
graphics.endFill();
});
