import { Ref, ref } from "vue"
import { CropLikeModule } from "../scripts/rt/engine"
import { FieldsModule } from "../scripts/tb/engine"

const croplikeModule = new CropLikeModule()
const fieldsModule = new FieldsModule()
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
