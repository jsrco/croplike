import { Ref, ref } from "vue"
import { Engine } from "../scripts/engine"

const huntsModule = new Engine('Hunts')
const fieldsModule = new Engine('Fields')
const gameContainer = ref()
const showInfo = ref(false)

let activeModule: Ref<any> = ref(fieldsModule) // huntsModule 
const switchMoudele = () => {
    activeModule.value.stopRun()
    gameContainer.value.removeChild(activeModule.value.world.engine.app.view)
    activeModule.value.name === 'Hunts' ? activeModule.value = fieldsModule : activeModule.value = huntsModule
    activeModule.value.startRun()
    activeModule.value.addCanvas(gameContainer.value)
}

const useEngine = (elementRef?: HTMLElement) => {
    if (elementRef) gameContainer.value = elementRef
    return {
        activeModule,
        huntsModule,
        fieldsModule,
        showInfo,
        switchMoudele
    }
}

export default useEngine
