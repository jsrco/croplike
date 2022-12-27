import { ref } from "vue"

type GameScreen = { render: () => {} }

const Screen = ref<GameScreen>()
const ScreenHeight = ref<number>()
const ScreenWidth = ref<number>()

const useScreen = (display?: GameScreen) => {

    const render = () => Screen.value?.render()
    const setScreen = (newScreen: GameScreen) => {
        Screen.value = newScreen
        setScreenSize(21)
    }
    const setScreenSize = (spriteSize: number) => {
        ScreenHeight.value = Math.floor(window.innerHeight - 36 / spriteSize)
        ScreenWidth.value = Math.floor(window.innerWidth / spriteSize)
        return {
            height: ScreenHeight.value % 2 === 0 ? ScreenHeight.value - 1 : ScreenHeight.value,
            width: ScreenWidth.value % 2 === 0 ? ScreenWidth.value - 1 : ScreenWidth.value
        }
    }    
    if (display) setScreen(display)
    
    return {
        Screen,
        render,
        ScreenHeight,
        ScreenWidth,
        setScreen,
        setScreenSize,
    }
}

export default useScreen
