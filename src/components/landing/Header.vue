<template>
  <div class="pt-24 sm:pt-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-4xl font-bold tracking-tight text-white sm:text-6xl font-start">{{ Header.title }}</h2>
        <p class="mt-6 text-lg leading-8 text-gray-300 font-share">{{ Header.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Copy } from "./../../scripts/site/copy"

const { Header } = Copy.Landing
</script>