import { Display } from "rot-js"
import { ref } from "vue"

type GameScreen = Display & { render: () => {} }

const Screen = ref<GameScreen>()
const ScreenHeight = ref<number>()
const ScreenWidth = ref<number>()
const SpriteSize = ref<number>(0)

const useScreen = (display?: GameScreen, options?: any) => {
    
    const render = () => Screen.value?.render()
    const setScreen = (newScreen: GameScreen) => Screen.value = newScreen
    const setScreenSize = (x: number, y: number) => {
        ScreenHeight.value = Math.floor(y / SpriteSize.value)
        ScreenWidth.value = Math.floor(x / SpriteSize.value)
    }
    const setSpriteSize = (size: number) => SpriteSize.value = size

    if (display) setScreen(display)
    if (options) {
        const { height, spriteSize, width} = options
        setSpriteSize(spriteSize)
        setScreenSize(height, width)
    }

    return {
        Screen,
        render,
        ScreenHeight,
        ScreenWidth,
        setScreen,
        setScreenSize,
        setSpriteSize,
        SpriteSize
    }
}

export default useScreen
