import * as PIXI from 'pixi.js'
import { ref } from "vue"

const Screen = ref<PIXI.Application>()
const setScreen = (newScreen: PIXI.Application) => Screen.value = newScreen
const setScreenSize = () => {
    Screen.value.renderer.resize(window.innerWidth, window.innerHeight - 36)
}

window.addEventListener('resize', () => {
    setScreenSize()
})

const useScreen = (display?: PIXI.Application) => {
    if (display) setScreen(display)
    return {
        Screen,
        setScreen,
        setScreenSize,
    }
}

export default useScreen
