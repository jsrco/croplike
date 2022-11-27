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

    if (storage.value.getUser() === undefined) {
        storage.value.setUser('test')
        console.log('test user set')
    }
    isActive.value = true
    isOutOfSynch.value = false

    return {
        clearUserStorage,
        isActive,
        isDev,
        isOutOfSynch,
        storage,
    }
}

export default useStorage
