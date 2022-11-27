<template>
    <div
        class="bg-dirt border-b border-gray-300 flex flex-row items-start justify-between px-1 sm:px-2 lg:px-3 py-1 top-0 w-full z-10">
        <div class="font-start text-white">
            Croplike
            <span class="font-share text-gray-400" :class="{ 'invisible': !isDev, 'visible': isDev }" @click="clearUserStorage()">:/debug</span>
        </div>
        <div
            :class="{ 'text-green-400': isActive && !isOutOfSynch, 'text-red-400': !isActive, 'text-yellow-400': isOutOfSynch, }">
            {{ storage.getUser() || 'none' }}</div>
    </div>
</template>

<script setup lang="ts">
import useStorage from './../composeables/useStorage'

const { clearUserStorage, isActive, isDev, isOutOfSynch, storage } = useStorage()
</script>