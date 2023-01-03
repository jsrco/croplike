import * as PIXI from 'pixi.js'
import { ref } from "vue"

const GameContainerTarget = ref()
const Screen = ref<PIXI.Application>({})
const ScreenHeight = ref(window.innerHeight - 36)
const ScreenWidth = ref(window.innerWidth)
const setScreen = (newScreen: PIXI.Application) => {
    Screen.value = newScreen
    setScreenSize()
    GameContainerTarget.value.innerHTML = ''
    GameContainerTarget.value.appendChild(Screen.value.view)
}
const setScreenSize = () => {
    ScreenHeight.value = window.innerHeight - 36
    ScreenWidth.value = window.innerWidth 
    Screen.value.renderer.resize(window.innerWidth, window.innerHeight - 36)
}

window.addEventListener('resize', () => {
    setScreenSize()
})

const useScreen = (display?: PIXI.Application) => {
    if (display) setScreen(display)
    return {
        GameContainerTarget,
        Screen,
        ScreenHeight,
        ScreenWidth,
        setScreen,
    }
}

export default useScreen
