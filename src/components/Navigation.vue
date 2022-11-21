<template>
    <div class="bg-dirt border-b border-gray-300 flex flex-row items-start justify-between px-1 sm:px-2 lg:px-3 py-1 top-0 w-full z-10">
        <div class="font-start text-white">
            Croplike 
            <span class="font-share text-gray-400" :class="{'invisible': !isDev, 'visible': isDev}">:/debug</span>
        </div>
        <div :class="{ 'text-green-400': isActive && !isOutOfSynch, 'text-red-400': isActive, 'text-yellow-400': isOutOfSynch, }">status</div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const isActive: Ref<boolean> = ref(true) 
const isDev: Ref<boolean> = ref(true)
const isOutOfSynch: Ref<boolean> = ref(true)
</script>