import {  ref, Ref } from "vue"
import { Engine } from "../scripts/Engine"

let game: any;
const useEngine = (target?: Ref<any>) => {
    if (target) game = new Engine(target)
    return {
        game
    }
}

export default useEngine
