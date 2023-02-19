import { Map } from 'rot-js'
import { ref } from 'vue'
import { Locals } from '../scripts/util/Storage'
import useStorage from './use-storage'


const map = ref()
const isOnMapScreen = ref(false)
const generateNewMap = () => {
    map.value = new Map.Cellular(50, 35)
    map.value.randomize(0.5)
    useStorage().storage.value.setType(Locals.Game_MAP, map.value)
}
const resetMap = () => {
    if (isOnMapScreen.value) {
        generateNewMap()
    } else console.dir('go back to a map screen')
}
const useCartographer = () => {
    if (!useStorage().storage.value.getType(Locals.Game_MAP)) { generateNewMap() } else { map.value = useStorage().storage.value.getType(Locals.Game_MAP) }

    const isOutBounds = (x: number, y: number) => { return x < 0 || x >= map.value._width || y < 0 || y >= map.value._height }

    return {
        generateNewMap,
        isOutBounds,
        map,
        resetMap
    }
}

export default useCartographer
