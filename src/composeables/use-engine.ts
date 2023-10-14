import { Engine as RTEngine } from "../scripts/rt/engine"
import { Engine as TBEngine } from "../scripts/tb/engine"

const RTGame = new RTEngine()
const TBGame = new TBEngine()

const useEngine = () => {
    return {
        RTGame,
        TBGame,
    }
}

export default useEngine
