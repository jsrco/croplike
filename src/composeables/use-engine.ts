import { Ref, ref } from "vue"
import { Engine } from "../scripts/engine"

const croplikeModule = new Engine('Croplike')
const fieldsModule = new Engine('Fields')
const gameContainer = ref()

let activeModule: Ref<any> = ref(fieldsModule) // croplikeModule
const switchMoudele = () => {
    activeModule.value.stopRun()
    gameContainer.value.removeChild(activeModule.value.world.engine.app.view)
    activeModule.value.name === 'Croplike' ? activeModule.value = fieldsModule : activeModule.value = croplikeModule
    activeModule.value.startRun()
    activeModule.value.addCanvas(gameContainer.value)
}
const useEngine = (elementRef?: HTMLElement) => {
    if (elementRef) gameContainer.value = elementRef
    return {
        activeModule,
        croplikeModule,
        fieldsModule,
        switchMoudele
    }
}

export default useEngine
