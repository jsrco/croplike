<template>
    <div class="px-6 py-32 lg:px-8">
        <div class="mx-auto max-w-7xl text-base leading-7 text-gray-300 font-roboto">
            <p class="text-base font-semibold leading-7 font-start">{{ About.title }}</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ About.headerOne }}</h1>
            <div class="mt-10 max-w-7xl">
                <p>{{ About.textOne }}</p>
                <ul role="list" class="mt-8 max-w-xl space-y-8">
                    <li v-for="item in About.subText" :key="item.id" class="flex gap-x-3">
                        <span><strong class="font-semibold text-white font-share">{{ item.title }}</strong> {{ item.text
                        }}</span>
                    </li>
                </ul>
                <p class="mt-8">{{ About.textTwo }}</p>
                
            <div class="mt-16 max-w-7xl">
                <h2 class="text-2xl font-bold tracking-tight text-white font-share">{{ About.headerTwo }}</h2>
                <p class="mt-6">{{ About.textThree }}</p>
                <p class="mt-8">{{ About.textFour }}</p>
            </div>
                <h2 class="mt-16 text-2xl font-bold tracking-tight text-white font-share">{{  About.headerThree }}</h2>
                <p class="mt-6">{{ About.textFive }}</p>
                <figure class="mt-10 border-l border-indigo-600 pl-9">
                    <blockquote class="font-semibold text-white font-share">
                        <p>{{ About.quote }}</p>
                    </blockquote>
                    <figcaption class="mt-6 flex gap-x-4">
                        <div class="text-sm leading-6"><strong class="font-semibold text-white font-share">{{ About.quoteName }}</strong> –
                            {{ About.quotePosition }}</div>
                    </figcaption>
                </figure>
                <p class="mt-10">{{ About.textSix }}</p>
            </div>
            <figure class="mt-16 flex flex-col items-center">
                <img class="rounded-xl object-cover"
                    src="../../assets/FatThunder.png"
                    alt="Fat Thunder Logo" />
                <figcaption class="mt-4 flex gap-x-2 text-sm leading-6 font-share">
                    A bit more infomration about<a class="font-bold text-red-400" href="https://www.fatthunder.com" target="_blank">Fat Thunder</a>
                </figcaption>
            </figure>
        </div>
    </div>
</template>
  
  
<script setup lang="ts">
import { Copy } from "./../../scripts/site/copy"

const { About } = Copy
</script>