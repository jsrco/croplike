import useScreen from "../composeables/useScreen"
import * as PIXI from 'pixi.js'
import { createGrid, mapScreen } from "./mapScreen"

PIXI.settings.SCALE_MODE = 0

export const startScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })

const PressStart2P = new FontFace(
    "PixiPressStart2P",
    "url('./assets/fonts/PressStart2P-Regular.ttf')"
)
PressStart2P.load().then(function (font) {
    // with canvas, if this is ommited won't work
    document.fonts.add(font)
    console.log('font loaded')

    const style = new PIXI.TextStyle({
        fontFamily: 'PixiPressStart2P',
        fontSize: 16,
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
    startScreen.stage.on('click', (event) => {
        //handle event
        useScreen(mapScreen)
        mapScreen.render()
        requestAnimationFrame(createGrid)
    })
})

PIXI.Assets.load('../assets/ff5x5.json').then(() => {
    // create an array to store the textures
    const ff5x5Texture = [];
    let i;
    
    for (i = 0; i < 26; i++) {
        const texture = PIXI.Texture.from(`ff5x5 ${i}.png`);
        ff5x5Texture.push(texture);
    }

    for (i = 0; i < 50; i++) {
        // create an explosion AnimatedSprite
        const explosion = new PIXI.AnimatedSprite(ff5x5Texture);

        explosion.x = Math.random() * startScreen.screen.width;
        explosion.y = Math.random() * startScreen.screen.height;
        explosion.interactive = true
        explosion.anchor.set(0.5);
        explosion.rotation = Math.random() * Math.PI;
        explosion.scale.set(0.75 + Math.random() * 0.5);
        explosion.gotoAndPlay(Math.random() * 26 | 0);
        explosion.on('pointerover', (event) => {
            //handle event
            explosion.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
        })
        startScreen.stage.addChild(explosion);
    }

    const backuptexture = PIXI.Texture.from(`ff5x5 0.png`)
    
    const renderedBackup = new PIXI.AnimatedSprite([backuptexture])

    renderedBackup.x = 50
    renderedBackup.y = 50
    renderedBackup.interactive = true
    renderedBackup.scale.set(10,10)
    renderedBackup.on('pointerleave', (event) => {
        //handle event
        renderedBackup.tint = 0xffffff

    })
    renderedBackup.on('pointerover', (event) => {
        //handle event
        renderedBackup.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
    })
    startScreen.stage.addChild(renderedBackup)


    // start animating
    startScreen.start();
})
