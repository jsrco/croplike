<template>
    <div class="game">
        <Info v-if="useEngine().showInfo.value === true" />
        <Navigation />
        <Screen />
    </div>
</template>
  
<script setup lang="ts">
import useEngine from "../../composeables/use-engine"
import Info from "./../pixi/Info.vue"
import Navigation from "./../pixi/Navigation.vue"
import Screen from "./../pixi/Screen.vue"
</script>

<style scoped>
.game {
    height: 100%;
    left: 0;
    outline: none;
    overflow: hidden;
    position: fixed;
    top: 0;
    -webkit-user-select: none;
    /* Safari */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE10+/Edge */
    user-select: none;
    /* Standard */
    width: 100%;
}
</style>