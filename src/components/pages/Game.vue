<template>
    <div :style="{ width: `${stageX}px`, height: `${stageY}px` }"
        class="absolute inset-0 text-white border sm:px-6 lg:px-8 p-4">
        <!-- Content goes here -->
        <div class="text-2xl leading-6 text-white font-roboto">
            <router-link to="/" @click="exitFullScreen">{{ `<- Back` }}</router-link>
            <div class="mt-4 font-start text-sm">Double click to enter full screen</div>
            <div class="font-start text-sm">Gameplay currently unavailable</div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const stageX = ref(window.innerWidth)
const stageY = ref(window.innerHeight)

const handleResize = () => {
    stageX.value = window.innerWidth
    stageY.value = window.innerHeight
}

const handleDoubleClick = () => {
    toggleFullScreen()
}

window.addEventListener('resize', handleResize)
window.addEventListener('dblclick', handleDoubleClick, false)

const exitFullScreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen()
    }
}

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
        document.exitFullscreen()
    }
}

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('dblclick', handleDoubleClick, false)
})
</script>
