import { CropLikeModule } from "../scripts/rt/engine"
import { FieldsModule } from "../scripts/tb/engine"

const croplikeModule = new CropLikeModule()
const fieldsModule = new FieldsModule()
const activeModule = fieldsModule // croplikeModule
const useEngine = () => {
    return {
        activeModule,
        croplikeModule,
        fieldsModule,
    }
}

export default useEngine
