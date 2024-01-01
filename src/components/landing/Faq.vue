<template>
    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 class="text-2xl font-bold leading-10 tracking-tight text-white font-share">{{ Faq.title }}</h2>
        <p class="mt-6 max-w-2xl text-base leading-7 text-gray-300 font-roboto">{{ Faq.text }}</p>
        <div class="mt-20">
            <dl class="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
                <div v-for="faq in Faq.questions" :key="faq.id">
                    <dt class="text-base font-semibold leading-7 text-white font-share">{{ faq.question }}</dt>
                    <dd class="mt-2 text-base leading-7 text-gray-300 font-roboto">{{ faq.answer }}</dd>
                </div>
            </dl>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { Copy } from "./../../scripts/site/copy"

const { Faq } = Copy.Landing
</script>