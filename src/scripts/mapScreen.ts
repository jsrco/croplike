import useScreen from "../composeables/useScreen"
import * as PIXI from 'pixi.js'
import { Container, Graphics, MSAA_QUALITY, Matrix, RenderTexture, Renderer, Sprite } from "pixi.js"
import { GameScreen } from "./gameScreen"
import { ref } from "vue"
import { actionScreen, createAction } from "./actionScreen"
import useCartographer from "../composeables/useCartographer"

PIXI.settings.SCALE_MODE = 0
PIXI.settings.SORTABLE_CHILDREN = true

const { Screen, ScreenHeight, ScreenWidth } = useScreen()
const { map } = useCartographer()

export const mapScreen: GameScreen = new GameScreen( { appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'mapScreen'})

const templateShape = new Graphics()
    .beginFill(0xffffff)
    .lineStyle({ width: 1, alignment: 0 })
    .drawRoundedRect(0, 0, 64, 64, 2)

const { width, height } = templateShape

// Draw the RoundedRect to the RenderTexture
const renderTexture = RenderTexture.create({
    width,
    height,
    multisample: MSAA_QUALITY.HIGH,
    resolution: window.devicePixelRatio
})
// With the existing renderer, render texture
// make sure to apply a transform Matrix
mapScreen.renderer.render(templateShape, {
    renderTexture,
    transform: new Matrix(1, 0, 0, 1, 0, 0)
});
// Required for MSAA, WebGL 2 only
(mapScreen.renderer as Renderer).framebuffer.blit()
// Discard the original Graphics
templateShape.destroy(true)

export const clickedObject = ref()
const style = new PIXI.TextStyle({
    fontFamily: 'PixiPressStart2P',
    fontSize: 8,
    fill: ['#fff'],
})
export const createGrid = () => {
    mapScreen.stage.removeChildren()
    const shapes: Sprite[] = []
    const gridSize = height
    const seperator = gridSize
    let counter = 0
    let xCount = 0
    for (let xStarter = 3; xStarter < ScreenWidth.value - seperator; xStarter += seperator) {
        let yStarter = 3
        let yCount = 0
        for (yStarter; yStarter < ScreenHeight.value - seperator; yStarter += seperator) {
            const shape = new Sprite(renderTexture)
            const position = [xCount,yCount]
            const shapeNumber = counter
            const type = map.value._map[xCount][yCount]
            shapes[counter] = shape
            shape.position.x = xStarter
            shape.position.y = yStarter
            shape.interactive = true
            shape.zIndex = counter
            shape.tint = map.value._map[xCount][yCount] === 1 ? 0xfad11 : 0x11111
            let text = new PIXI.Text( `${xCount}, ${yCount}\n${counter}\n${map.value._map[xCount][yCount]}`, style);
            shape.addChild(text)

            shape.on('pointerleave', (event) => {
                //handle event
                // shape.tint = 0xffffff
                const sHeight = shape.height
                shape.zIndex -= shapes.length
                shape.scale.set(1, 1)
                shape.position.x += (sHeight - shape.height) / 2
                shape.position.y += (sHeight - shape.height) / 2
                //shape.removeChild(text)
            })
            shape.on('pointerover', (event) => {
                // handle event
                // shape.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16)
                const sHeight = shape.height
                shape.zIndex += shapes.length
                shape.scale.set(1.1, 1.1)
                shape.position.x -= (shape.height - sHeight) / 2
                shape.position.y -= (shape.height - sHeight) / 2
                text.position.x = 0
                text.position.y = 0
                //shape.addChild(text)
            })
            shape.on('pointertap', (event) => {
                //handle event
                mapScreen.stage.removeChildren()
                clickedObject.value = {position, shapeNumber, type}
                useScreen(actionScreen)
                actionScreen.render()
                requestAnimationFrame(createAction)
            })
            counter++
            yCount++
        }
        xCount++
    }
    const container = new Container()
    container.addChild(...shapes)

    mapScreen.stage.addChild(container)
}


window.addEventListener('resize', () => {
    if (Screen.value?.stageName === 'mapScreen') {
        createGrid()
    }
})
