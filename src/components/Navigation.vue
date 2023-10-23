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
        <div v-for="(item, index) in debugList" :class="{ 'font-bold text-red-400': index === 0 }"
            class="font-share text-gray-400 active:text-green-400 hover:text-white " @click="operateDebug(item.operation)">
            {{ item.name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue"
import useEngine from "../composeables/use-engine"
import { PhysicsSystem } from "./../scripts/shared/systems/physics"
import { RenderSystem } from "../scripts/shared/systems/render"

const { switchMoudele } = useEngine()

const switchWorld = ref(0)

const topic = ref('Fields')

const debugList = computed(() => {
    const croplike = [
        {
            name: 'SWTICH TO TB',
            operation: () => {
                switchMoudele()
                topic.value = 'Fields'
            }
        },
        {
            name: 'switch room demo',
            operation: () => {
                if (switchWorld.value === 0) switchWorld.value = 1
                else switchWorld.value = 0
                useEngine().activeModule.switchWorld(switchWorld.value, useEngine().activeModule.player)
            }
        },
        {
            name: 'console.dir info',
            operation: () => {
                console.dir(useEngine().activeModule)
            }
        },
        {
            name: 'console.dir save',
            operation: () => {
                console.dir(useEngine().activeModule.localStorageManager.getData())
            }
        },
        {
            name: 'clear save',
            operation: () => {
                useEngine().activeModule.localStorageManager.clearData()
            }
        },
        {
            name: 'load',
            operation: () => {
                useEngine().activeModule.load()
            }
        },
        {
            name: 'pause',
            operation: () => {
                useEngine().activeModule.pause()
            }
        },
        {
            name: 'save',
            operation: () => {
                useEngine().activeModule.save()
            }
        },
        {
            name: 'trigger collider borders',
            operation: () => {
                const physics = useEngine().activeModule.world.getSystemByType('physics') as PhysicsSystem
                if (physics) {
                    physics.triggerShowColliderBounds()
                }
            }
        },
        {
            name: 'setTarget to bigDemo',
            operation: () => {
                // active outside starter room
                const render = useEngine().activeModule.world.getSystemByType('render') as RenderSystem
                const entity = useEngine().activeModule.world.getEntityByName('bigDemo')
                if (entity) render.setTarget(entity)
            }
        },
    ]

    const fields = [
        {
            name: 'SWTICH TO RT',
            operation: () => {
                switchMoudele()
                topic.value = 'Croplike'
            }
        },
        {
            name: 'console.dir info',
            operation: () => {
                console.dir(useEngine().activeModule)
            }
        },
        {
            name: 'console.log entity info',
            operation: () => {
                for (const entity of useEngine().activeModule.world.entities) {
                    console.log(entity.name, entity.components.pixi.position)
                    console.log(entity.name, entity.components.pixi.positionTarget)
                    console.log(entity.name, entity.components.pixi.size)
                }
            }
        },
    ]
    return topic.value === 'Croplike' ? croplike : fields
})

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

</script>../scripts/shared/systems/physics