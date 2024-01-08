<template>
    <div class="px-6 pt-12 sm:pt-16 pb-24 sm:pb-32 lg:px-8">
        <div class="mx-auto max-w-7xl text-base leading-7 text-gray-300 font-roboto">
            <div class="mt-10 max-w-7xl">
                <div class="mt-16 max-w-7xl">
                    <h2 class="text-2xl font-bold tracking-tight text-white font-share">{{ About.headerOne }}</h2>
                    <div
                        class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-300 lg:max-w-none lg:grid-cols-2 font-roboto">
                        <div>
                            <p>{{ About.subTextOne }}</p>
                            <p class="mt-8">{{ About.subTextTwo }}</p>
                        </div>
                        <div>
                            <p>{{ About.subTextThree }}</p>
                            <img class="rounded-xl object-cover mt-8" src="/assets/ff5x5-sheet.png"
                            alt="Sprite Shee Filler Img" />
                        </div>
                    </div>
                </div>
                <div class="mt-16 max-w-7xl">
                    <h2 class="text-2xl font-bold tracking-tight text-white font-share">{{ About.headerTwo }}</h2>
                    <div
                        class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-300 lg:max-w-none lg:grid-cols-2 font-roboto">
                        <div>
                            <p>{{ About.textOne }}</p>
                            <p class="mt-8">{{ About.textTwo }}</p>
                        </div>
                        <div>
                            <p>{{ About.textThree }}</p>
                            <p class="mt-8">{{ About.textFour }}</p>
                        </div>
                    </div>
                </div>
                <h2 class="mt-16 text-2xl font-bold tracking-tight text-white font-share">{{ About.headerThree }}</h2>
                <figure class="mt-10 border-l border-blue-400 pl-9">
                    <blockquote class="font-semibold text-white font-share">
                        <p>{{ About.quote }}</p>
                    </blockquote>
                    <figcaption class="mt-6 flex gap-x-4">
                        <div class="text-sm leading-6"><strong class="font-semibold text-white font-share">{{
                            About.quoteName }}</strong> –
                            {{ About.quotePosition }}</div>
                    </figcaption>
                </figure>
                <div
                    class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-300 lg:max-w-none lg:grid-cols-2 font-roboto">
                    <div>
                        <p>{{ About.textFive }}</p>
                    </div>
                    <div>
                        <p>{{ About.textSix }}</p>
                    </div>
                </div>
            </div>
            <figure class="mt-16 flex flex-col items-center">
                <img class="rounded-xl object-cover" src="../../assets/FatThunder.png" alt="Fat Thunder Logo" />
                <figcaption class="mt-4 flex gap-x-2 text-sm leading-6 font-share">
                    A bit more infomration about <a class="font-bold text-red-400" href="https://www.fatthunder.com"
                        target="_blank">Fat Thunder</a>
                </figcaption>
            </figure>
        </div>
    </div>
</template>
  
  
<script setup lang="ts">
import { Copy } from "./../../scripts/site/copy"

const { About } = Copy
</script>