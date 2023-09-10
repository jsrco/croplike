<template>
    <div
        class="bg-dirt border-b border-gray-300 flex flex-row items-start justify-between px-1 sm:px-2 lg:px-3 py-1 top-0 w-full z-10">
        <div class="font-start text-white">
            Croplike
            <span class="cursor-pointer dropdown font-share"
                :class="{ 'text-gray-400': !isInDebug, 'text-white': isInDebug }" @click="toggleDebug()">
                {{ `:${isInDebug ? "/" : ""}debug` }}
            </span>
        </div>
    </div>
    <div v-if="isInDebug"
        class="absolute bg-dirt border border-gray-300 dropdown flex flex-col pl-4 pr-3 py-1 rounded-sm max-w-12 z-40">
        <div v-for="item in debugList" class="font-share text-gray-400 active:text-green-400 hover:text-white "
            @click="operateDebug(item.operation)">
            {{ item.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import useEngine from "../composeables/use-engine"
import { PhysicsSystem } from "../scripts/systems/physics"

const { game } = useEngine()

const debugList = [
    {
        name: 'console.dir info',
        operation: () => {
            console.dir(game)
            console.dir(game.room.entities)
        }
    },
    {
        name: 'clear save',
        operation: () => {
            game.localStorageManager.clearData()
        }
    },
    {
        name: 'load save',
        operation: () => {
            game.load()
        }
    },
    {
        name: 'pause game',
        operation: () => {
            game.pause()
        }
    },
    {
        name: 'save',
        operation: () => {
            game.save()
        }
    },
    {
        name: 'trigger collider bounds',
        operation: () => {
            const physics = game.room.getSystemByType('physics') as PhysicsSystem
            if (physics) { 
                console.log('ran')
                physics.triggerShowColliderBounds()
            }
        }
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
