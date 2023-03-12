import { ref } from 'vue'
import { GameStorage, Locals } from '../scripts/util/Storage'

const isActive = ref(false)
const isDev = ref(true)
const isOutOfSynch = ref(false)
const storage = ref()

const useStorage = () => {
    storage.value = GameStorage.getInstance()

    const checkIfSynched = () => {
        storage.value.getType(Locals.Game_USER) ? isActive.value = true : isActive.value = false
        !storage.value.getType(Locals.Game_USER) ? isOutOfSynch.value = true : isOutOfSynch.value = false
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
