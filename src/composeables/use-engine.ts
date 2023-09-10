import { Engine } from "../scripts/engine"

const game = new Engine()
const useEngine = () => {
    return {
        game,
    }
}

export default useEngine
