<template>
    <div :style="{ width: `${stageX}px`, height: `${stageY}px` }"
        class="absolute inset-0 text-white z-50 sm:px-6 lg:px-8 p-4">
        <!-- Content goes here -->
    </div>
</template>
  
  
<script setup lang="ts">
import { ref } from 'vue'

const stageX = ref(self.innerWidth)
const stageY = ref(self.innerHeight)
window.addEventListener('resize', () => {
    stageX.value = self.innerWidth
    stageY.value = self.innerHeight
})
</script>