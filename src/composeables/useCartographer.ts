import { Map } from 'rot-js'
import { ref } from "vue"

const map = ref()
const generateNewMap = () => { 
    map.value = new Map.Cellular(50,35)
    map.value.randomize(0.5)
}
const isOutBounds = (x: number,y: number) => { return x < 0 || x >= map.value._width || y < 0 || y >= map.value._height }
const useCartographer = () => {
    generateNewMap()
    return {
        generateNewMap,
        isOutBounds,
        map
    }
}

export default useCartographer
