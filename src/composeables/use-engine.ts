import { ref } from "vue"
import { Engine } from "../scripts/Engine"

const game = new Engine()
const showInfo = ref(true)
const useEngine = () => {
    return {
        game,
        showInfo
    }
}

export default useEngine
