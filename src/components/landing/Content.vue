<template>
  <div class="pt-24 sm:pt-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-share">{{ Content.title }}</h1>
        <div
          class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-300 lg:max-w-none lg:grid-cols-2 font-roboto">
          <div>
            <p>{{ Content.textOne }}</p>
            <p class="mt-8">{{ Content.textTwo }}</p>
          </div>
          <div>
            <p>{{ Content.textThree }}</p>
            <p class="mt-8">{{ Content.textFour }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Copy } from "./../../scripts/site/copy"

const { Content } = Copy.Landing
</script>
  