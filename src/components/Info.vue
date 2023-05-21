<template>
    <div v-if="showInfo && !smolScreen()"
        class="z-30 absolute bottom-0 left-0 info w-screen text text-white bg-dirt pt-4 pl-4 overflow-y-scroll">
        <h1 class="pb-4">
            Welcome to Croplike. A project by <a class="text-red-400 font-bold" href="https://www.fatthunder.com"
                target="_blank">Fat Thunder</a>.<br><br>
            The demo allows the player to <span class="font-bold">move</span> around an arena. Movement consist of <span
                class="font-bold">jumping</span>, <span class="font-bold">wall sliding</span>, and <span
                class="font-bold">wall jumping</span>.<br><br>
            These movement features can also be done on the sides of large entities.<br>
            Large entities can <span class="font-bold">compress</span> in size as they are being stood on. They
            return to normal size once the player jumps off.<br><br>
            The demo is at a very basic state. With geometry representing the arena and entities.<br><br>
            You can move with the <span class="font-bold text-yellow-400">left</span> and <span
                class="font-bold text-yellow-400">right arrow</span> keys.<br>
            If the player moves in the direction of the wall or entity they are sliding down, they can preform a <span
                class="font-bold">wall hang</span>.<br>
            The player can jump by hitting the <span class="font-bold text-yellow-400">up arrow</span>.<br><br>
            The <span class="text-blue-400 font-bold">debug</span> menu support <span class="font-bold">pausing</span>,
            <span class="font-bold">saving</span>, and <span class="font-bold">loading</span>. For the keyboard commands of
            the same features, hit <span class="font-bold text-yellow-400">p</span>,
            <span class="font-bold text-yellow-400">s</span> and <span class="font-bold text-yellow-400">l</span>.<br>
            More progress as time allows.<br><br>
        </h1>
        <p class="text-green-400 font-bold text-xl fixed bottom-0 pb-4 bg-dirt w-full" @click="startGame()">Click here to start the demo!</p>
    </div>
    <div v-if="smolScreen()"
        class="z-30 absolute top-0 left-0 h-screen w-screen text text-white bg-dirt pt-8 pl-8">
            Welcome to Croplike. A project by <a class="text-red-400 font-bold" href="https://www.fatthunder.com"
                target="_blank">Fat Thunder</a>.<br>
            I see you are on a tablet or mobile device. I am sorry. <span class="font-bold">This won't work right now.</span><br><br>
            Go get a computer and try again.<br><br>
            Don't have one? You get to wait. <br><br>
            You aren't missing anything. Might I recommend you take off your shoes and touch some grass? 
    </div>
</template>
  
<script setup lang="ts">
import useEngine from "../composeables/use-engine"

const { game, showInfo } = useEngine()

const smolScreen = () => {
    if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            return true 
         } else {
            return false
         }
}

const startGame = () => {
    showInfo.value = false
    if (game.paused.value === true) game.pause()
}

</script>
  
<style>.info {
    height: calc(100vh - 36px);
}</style>{}