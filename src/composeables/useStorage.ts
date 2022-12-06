import { GameStorage } from "./storage"
import { ref } from "vue"

const isActive = ref(false)
const isDev = ref(true)
const isOutOfSynch = ref(true)
const storage = ref()

const useStorage = () => {
    storage.value = GameStorage.getInstance()

    const clearUserStorage = () => {
        storage.value.clear()
        isActive.value = false
        console.log('userStorage wiped, account inactive')
    }

    const resetUserStorage = () => {
        isActive.value = true
        if (storage.value.getUser() === undefined) {
            storage.value.setUser('testUser')
            console.log('"testUser" user set')
        }
        console.log('userStorage set, account active')
    }

    resetUserStorage()
    isActive.value = true

    isOutOfSynch.value = false

    return {
        clearUserStorage,
        isActive,
        isDev,
        isOutOfSynch,
        resetUserStorage,
        storage,
    }
}

export default useStorage
