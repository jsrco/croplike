import { Map } from 'rot-js'
import { ref } from "vue"
import { createGrid, mapScreen } from '../scripts/mapScreen'
import { Locals } from '../scripts/storage'
import useScreen from './useScreen'
import useStorage from './useStorage'

const { Screen } = useScreen()

const map = ref()
const generateNewMap = () => { 
    map.value = new Map.Cellular(50,35)
    map.value.randomize(0.5)
    useStorage().storage.value.setType(Locals.Game_MAP, map.value)
}
const resetMap = () => {
    if (Screen.value?.stageName === 'mapScreen') {
        generateNewMap()
        useScreen(mapScreen)
        mapScreen.render()
        requestAnimationFrame(createGrid)
    } else throw Error('go back to map')
}
const useCartographer = () => {
    if (!useStorage().storage.value.getType(Locals.Game_MAP)) { generateNewMap() } else { map.value = useStorage().storage.value.getType(Locals.Game_MAP)}

    const isOutBounds = (x: number,y: number) => { return x < 0 || x >= map.value._width || y < 0 || y >= map.value._height }

    return {
        generateNewMap,
        isOutBounds,
        map,
        resetMap
    }
}

export default useCartographer
