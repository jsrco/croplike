import { Engine } from "../scripts/rt/engine"

const game = new Engine()
const useEngine = () => {
    return {
        game,
    }
}

export default useEngine
