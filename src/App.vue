<template>
  <Info v-if="useEngine().showInfo.value === true" />
  <Navigation />
  <Screen />
</template>

<script setup lang="ts">
import Info from "./components/Info.vue"
import Navigation from "./components/Navigation.vue"
import Screen from "./components/Screen.vue"
import useEngine from "./composeables/use-engine"
</script>