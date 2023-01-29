import { Map } from 'rot-js'
import { Ref, ref } from "vue"

const map = ref()
const generateNewMap = () => { 
    map.value = new Map.Cellular(50,50)
    map.value.randomize(0.2)
}
const useCartographer = () => {
    generateNewMap()
    return {
        generateNewMap,
        map
    }
}

export default useCartographer
