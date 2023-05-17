import { reactive } from "vue"
import { Engine } from "../scripts/Engine"

const game = new Engine()

const useEngine = () => {
    return {
        game,
    }
}

export default useEngine
