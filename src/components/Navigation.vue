<template>
    <nav :class="{
        'hidden': currentRoutePath === '/game' || currentRoutePath === '/pixi-demo'
    }" class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex flex-1">
        </div>
        <div class="flex gap-x-12">
            <div v-for="item in navigation" :key="item.name" :class="{
                'underline underline-offset-8': currentRoutePath === item.href
            }" class="text-2xl leading-6 text-white font-roboto">
                <router-link :to="item.href">{{ item.name }}</router-link>
            </div>
        </div>
        <div class="flex flex-1 justify-end">
        </div>
    </nav>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const currentRoutePath = ref(router.currentRoute.value.path)
const updateRoutePath = () => {
    currentRoutePath.value = router.currentRoute.value.path
}

onMounted(() => {
    // Add a navigation guard to update the route path when the route changes
    router.afterEach(updateRoutePath)
})

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Game', href: '/game' },
    // { name: 'Pixi-Demo', href: '/pixi-demo' },
]
</script>