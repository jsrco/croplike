import useScreen from "../composeables/useScreen"
import * as PIXI from 'pixi.js'
import { Container, Graphics, MSAA_QUALITY, Matrix, RenderTexture, Renderer, Sprite } from "pixi.js"
import { startScreen } from "./startScreen"

PIXI.settings.SCALE_MODE = 0

const { Screen, ScreenHeight, ScreenWidth } = useScreen()
export const mapScreen: PIXI.Application = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight - 36, })
mapScreen.specialStagename = 'mapScreen'

const templateShape = new Graphics()
    .beginFill(0xffffff)
    .lineStyle({ width: 1, alignment: 0 })
    .drawRoundedRect(0, 0, 32, 32, 2)
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

export const createGrid = () => {
    mapScreen.stage.removeChildren()
    const shapes: Sprite[] = []
    const gridSize = height
    const seperator = gridSize
    let counter = 0
    for (let xStarter = 3; xStarter < ScreenWidth.value - seperator; xStarter += seperator) {
        let yStarter = 3
        for (yStarter; yStarter < ScreenHeight.value - seperator; yStarter += seperator) {
            const shape = new Sprite(renderTexture);
            shapes[counter] = shape
            counter++
            shape.position.x = xStarter
            shape.position.y = yStarter
            shape.interactive = true
            shape.on('pointerleave', (event) => {
                //handle event
                shape.tint = 0xffffff
                const sHeight = shape.height
                shape.scale.set(1, 1)
                shape.position.x += (sHeight - shape.height) / 2
                shape.position.y += (sHeight - shape.height) / 2
                shape.zIndex
            })
            shape.on('pointerover', (event) => {
                //handle event
                shape.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16)
                const sHeight = shape.height
                shape.scale.set(1.2, 1.2)
                shape.position.x -= (shape.height - sHeight) / 2
                shape.position.y -= (shape.height - sHeight) / 2
                shape.position.z = 1000
            })
            shape.on('pointertap', (event) => {
                //handle event
                mapScreen.stage.removeChildren()
                useScreen(startScreen)
            })
        }
    }
    const container = new Container()
    container.addChild(...shapes)

    mapScreen.stage.addChild(container)
}


window.addEventListener('resize', () => {
    if (Screen.value.specialStagename === 'mapScreen') {
        createGrid()
    }
})
