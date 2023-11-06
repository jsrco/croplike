<template>
    <div
        class="bg-dirt border-b border-gray-300 flex flex-row items-start justify-between px-1 sm:px-2 lg:px-3 py-1 top-0 w-full z-10">
        <div class="font-start text-white">
            Croplike
            <span class="cursor-pointer dropdown font-share"
                :class="{ 'text-gray-400': !isInDebug, 'text-white': isInDebug }" @click="toggleDebug()">
                :debug/{{ useEngine().activeModule.value.name }}
            </span>
        </div>
    </div>
    <div v-if="isInDebug"
        class="absolute bg-dirt border border-gray-300 dropdown flex flex-col pl-4 pr-3 py-1 rounded-sm max-w-12 z-40">
        <div v-for="(item, index) in debugList" :class="{ 'font-bold text-red-400': index === 0 }"
            class="font-share text-gray-400 active:text-green-400 hover:text-white " @click="operateDebug(item.operation)">
            {{ item.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue"
import useEngine from "../composeables/use-engine"
import { RenderSystem } from "../scripts/systems/render"
import { PhysicsSystem } from "./../scripts/systems/physics"

const { switchMoudele } = useEngine()

const switchWorld = ref(0)

const topic = ref(useEngine().activeModule.value.name)

const debugList = computed(() => {
    const croplike = [
        {
            name: 'SWTICH TO Fields',
            operation: () => {
                switchMoudele()
                topic.value = 'Fields'
            }
        },
        {
            name: 'switch room demo',
            operation: () => {
                if (switchWorld.value === 1) switchWorld.value = 2
                else switchWorld.value = 1
                useEngine().activeModule.value.switchWorld(switchWorld.value, useEngine().activeModule.value.player)
            }
        },
        {
            name: 'trigger collider borders',
            operation: () => {
                const physics = useEngine().activeModule.value.world.getSystemByType('physics') as PhysicsSystem
                if (physics) {
                    physics.triggerShowColliderBounds()
                }
            }
        },
        {
            name: 'set camera target to bigDemo',
            operation: () => {
                // active outside starter room
                const render = useEngine().activeModule.value.world.getSystemByType('render') as RenderSystem
                const entity = useEngine().activeModule.value.world.getEntityByName('bigDemo')
                if (entity) render.setTarget(entity)
            }
        },
    ]
    const defaults = [
        {
            name: 'toggle info',
            operation: () => {
                useEngine().showInfo.value = true
            }
        },
        {
            name: 'console.dir module',
            operation: () => {
                console.dir(useEngine().activeModule.value)
            }
        },
        {
            name: 'console.log entity info',
            operation: () => {
                for (const entity of useEngine().activeModule.value.world.entities) {
                    console.log(entity.name)
                    console.log(entity.components.position.position.x, entity.components.position.position.y)
                    console.log(entity.components.size.size.x, entity.components.size.size.y)
                    console.log(entity.components.pixi.sprite.position.x,entity.components.pixi.sprite.position.y)
                    console.log(entity.components.pixi.sprite.width, entity.components.pixi.sprite.height)
                }
            }
        },
        {
            name: 'console.dir save',
            operation: () => {
                console.dir(useEngine().activeModule.value.localStorageManager.getData())
            }
        },
        {
            name: 'clear save',
            operation: () => {
                useEngine().activeModule.value.localStorageManager.clearData()
            }
        },
        {
            name: 'load',
            operation: () => {
                useEngine().activeModule.value.load()
            }
        },
        {
            name: 'pause',
            operation: () => {
                useEngine().activeModule.value.pause()
            }
        },
        {
            name: 'save',
            operation: () => {
                useEngine().activeModule.value.save()
            }
        },
    ]
    const fields = [
        {
            name: 'SWTICH TO Hunts',
            operation: () => {
                switchMoudele()
                topic.value = 'Hunts'
            }
        },
    ]
    return topic.value === 'Hunts' ? [...croplike, ...defaults] : [...fields, ...defaults]
})

const isInDebug: Ref<boolean> = ref(false)

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