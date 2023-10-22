import { ref } from "vue"
import { CropLikeModule } from "../scripts/rt/engine"
import { FieldsModule } from "../scripts/tb/engine"

const croplikeModule = new CropLikeModule()
const fieldsModule = new FieldsModule()
const gameContainer = ref()

let activeModule: any = fieldsModule // croplikeModule
const switchMoudele = () => {
    activeModule.stopRun()
    gameContainer.value.removeChild(activeModule.world.engine.app.view)
    activeModule.name === 'Croplike' ? activeModule = fieldsModule : activeModule = croplikeModule
    activeModule.startRun()
    activeModule.addCanvas(gameContainer.value)
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
