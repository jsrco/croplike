import { CropLikeModule } from "../scripts/rt/engine"
import { FieldsModule } from "../scripts/tb/engine"

const croplikeModule = new CropLikeModule()
const fieldsModule = new FieldsModule()

const useEngine = () => {
    return {
        croplikeModule,
        fieldsModule,
    }
}

export default useEngine
