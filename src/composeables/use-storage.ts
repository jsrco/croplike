import { ref } from 'vue'
import { GameStorage, Locals } from '../scripts/storage'
import useCartographer from './use-cartographer'

const isActive = ref(false)
const isDev = ref(true)
const isOutOfSynch = ref(false)
const storage = ref()

const useStorage = () => {
    storage.value = GameStorage.getInstance()

    const checkIfSynched = () => {
        storage.value.getType(Locals.Game_USER) ? isActive.value = true : isActive.value = false
        !storage.value.getType(Locals.Game_MAP) || !storage.value.getType(Locals.Game_USER) ? isOutOfSynch.value = true : isOutOfSynch.value = false
    }

    const clearUserStorage = () => {
        storage.value.clearAll()
        checkIfSynched()
        console.dir('userStorage wiped, account inactive')
    }

    const resetUserStorage = () => {
        if (!storage.value.getType(Locals.Game_USER)) {
            storage.value.setType(Locals.Game_USER, 'testUser')
            console.dir('"game-user" test user set')
        }
        if (!storage.value.getType(Locals.Game_MAP)) {
            const { generateNewMap } = useCartographer()
            generateNewMap()
            console.dir('"game-map" game map created')
        }
        checkIfSynched()
        console.dir('account active')
    }

    checkIfSynched()

    return {
        checkIfSynched,
        clearUserStorage,
        isActive,
        isDev,
        isOutOfSynch,
        resetUserStorage,
        storage,
    }
}

export default useStorage
