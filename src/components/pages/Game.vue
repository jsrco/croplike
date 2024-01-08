<template>
    <div :style="{ width: `${stageX}px`, height: `${stageY}px` }"
        class="absolute inset-0 text-white border sm:px-6 lg:px-8 p-4">
        <!-- Content goes here -->
        <iframe src="assets/web/index.html" title="Godot Demo" width="100%" height="100%"></iframe>
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
