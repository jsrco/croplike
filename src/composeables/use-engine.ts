import { ref } from "vue"
import { Clicker } from "../scripts/Clicker"
import { Engine } from "../scripts/Engine"

// const game = new Clicker()
const game = new Engine()
const showInfo = ref(true)
const useEngine = () => {
    return {
        game,
        showInfo
    }
}

export default useEngine
