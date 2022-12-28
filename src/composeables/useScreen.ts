import * as PIXI from 'pixi.js'
import { ref } from "vue"

const GameContainerTarget = ref()
const Screen = ref<PIXI.Application>({})
const setScreen = (newScreen: PIXI.Application) => {
    Screen.value = newScreen
    setScreenSize()
    GameContainerTarget.value.innerHTML = ''
    GameContainerTarget.value.appendChild(Screen.value.view)
}
const setScreenSize = () => {
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
        setScreen,
    }
}

export default useScreen
