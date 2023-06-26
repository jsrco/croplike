<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'

const screenContainer = ref()


// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new Scene()
scene.background = new Color('#1d1d1d'); // Set black background color
// Object
const cubeGeometry = new BoxGeometry(1, 1, 1)
const cubeMaterial = new MeshBasicMaterial({
    color: '#ff0000'
})
const cubeMesh = new Mesh(cubeGeometry, cubeMaterial)
scene.add(cubeMesh)

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

onMounted(() => {
    // Renderer
    const renderer = new WebGLRenderer({
        canvas: screenContainer.value
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderer.render(scene, camera)
})
</script>