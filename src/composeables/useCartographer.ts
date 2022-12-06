import { ref } from "vue"

const aMap = ref('get lost')

const useCartographer = () => {
    return {
        aMap
    }
}

export default useCartographer
