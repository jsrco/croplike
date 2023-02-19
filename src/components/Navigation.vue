<template>
    <div
        class="bg-dirt border-b border-gray-300 flex flex-row items-start justify-between px-1 sm:px-2 lg:px-3 py-1 top-0 w-full z-10">
        <div class="font-start text-white">
            Croplike
            <span class="cursor-pointer dropdown font-share"
                :class="{ 'invisible': !isDev, 'text-gray-400': !isInDebug, 'text-white': isInDebug, 'visible': isDev }"
                @click="toggleDebug()">
                {{ `:${isInDebug ? "/" : ""}debug` }}
            </span>
        </div>
        <div
            :class="{ 'text-green-400': isActive && !isOutOfSynch, 'text-red-400': !isActive && isOutOfSynch, 'text-yellow-400': isActive && isOutOfSynch, }">
            {{ storage.getType(Locals.Game_USER) || 'none' }}
        </div>
    </div>
    <div v-if="isInDebug"
        class="absolute bg-dirt border border-gray-300 dropdown flex flex-col pl-4 pr-3 py-1 rounded-sm max-w-12 z-20">
        <div v-for="item in debugList" class="font-share text-gray-400 active:text-green-400 hover:text-white "
            @click="operateDebug(item.operation)">
            {{ item.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Locals } from "../scripts/util/Storage"
import useCartographer from '../composeables/use-cartographer'
import useStorage from '../composeables/use-storage'

const { clearUserStorage, isActive, isDev, isOutOfSynch, resetUserStorage, storage } = useStorage()

const debugList = [
    {
        name: 'console storage',
        operation: () => {
            console.dir(storage.value.getType(Locals.Game_USER))
            console.dir(storage.value.getType(Locals.Game_MAP))
        }
    },
    {
        name: 'clear user storage',
        operation: () => clearUserStorage()
    },
    {
        name: 'reset user storage',
        operation: () => resetUserStorage()
    },
    {
        name: 'reset game map',
        operation: () => useCartographer().resetMap()
    },
]

const isInDebug: Ref<Boolean> = ref(false)

const operateDebug = (task: any) => {
    task()
    toggleDebug()
}

const toggleDebug = () => {
    isInDebug.value = !isInDebug.value
}

window.onclick = (e) => {
    if (!e.composedPath().includes(document.querySelector('.dropdown')!) && isInDebug.value === true) toggleDebug()
}
</script>