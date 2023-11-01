<template>
    <div class="z-30 absolute top-0 left-0 h-full w-full text text-white font-share bg-dirt p-4 overflow-y-scroll">
        <div class="font-start text-xl">
            Croplike
        </div>
        <div class="pt-4">
            Created by <a class="font-bold text-red-400" href="https://www.fatthunder.com" target="_blank">Fat Thunder</a>
        </div>
        <div class="pt-2">
            Croplike is a browser-based game. It is powered by a custom ECS engine and will utilize <a
                class="font-bold pt-2 text-blue-400" href="https://pixijs.com/" target="_blank">PixiJS</a>, <a
                class="font-bold pt-2 text-blue-400" href="https://rapier.rs/" target="_blank">Rapier</a>, and <a
                class="font-bold pt-2 text-blue-400" href="https://ondras.github.io/rot.js/manual/"
                target="_blank">rot.js</a>.<br />The goal is to create a meaningful game play experience to help players
            deal with loss.
        </div>
        <div class="pt-2">
            See the code on
            <a class="font-bold pt-2 text-green-400" href="https://github.com/jsrco/croplike" target="_blank">GitHub</a>
        </div>
        <div @click="toggleInfo">
            <div class="pt-4 text-lg">Click here to access the real time <span
                    class="font-bold text-yellow-400 ">"Hunts"</span> and turn based <span
                    class="font-bold text-yellow-400 ">"Fields"</span> modules!</div>
            <div class="font-bold text-yellow-400">** Project still in early stages. **</div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import useEngine from '../composeables/use-engine'

const toggleInfo = () => {
    useEngine().showInfo.value = false
    if (useEngine().activeModule.value.paused === true) useEngine().activeModule.value.pause()
}
</script>