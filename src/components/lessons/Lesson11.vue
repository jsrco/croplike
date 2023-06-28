<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AxesHelper, BoxGeometry, BufferAttribute, BufferGeometry, Clock, Color, ColorManagement, LinearSRGBColorSpace, LoadingManager, Mesh, MeshBasicMaterial, NearestFilter, OrthographicCamera, PerspectiveCamera, RepeatWrapping, Scene, SphereGeometry, Texture, TextureLoader, WebGLRenderer } from 'three'
import * as dat from 'lil-gui'

const loadingManager = new LoadingManager()
loadingManager.onStart = () => {
    console.log('loading started')
}
loadingManager.onLoad = () => {
    console.log('loading finished')
}
loadingManager.onProgress = () => {
    console.log('loading progressing')
}
loadingManager.onError = () => {
    console.log('loading error')
}
const textureLoader = new TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/minecraft.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/door/color.jpg')
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = RepeatWrapping
// colorTexture.wrapT = RepeatWrapping
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
colorTexture.magFilter = NearestFilter
colorTexture.generateMipmaps = false
colorTexture.minFilter = NearestFilter
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')


/**
 * Debug
 */
const gui = new dat.GUI()

const screenContainer = ref()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

ColorManagement.enabled = false

// Scene
const scene = new Scene()
scene.background = new Color('#1d1d1d') // Set black background color
// Object
const cubeGeometry = new BoxGeometry(1, 1, 1)
const cubeMaterial = new MeshBasicMaterial({
    map: colorTexture,
    wireframe: false,
})
const cubeMesh = new Mesh(cubeGeometry, cubeMaterial)
gui
    .add(cubeMesh.position, 'y')
    .min(- 3)
    .max(3)
    .step(0.01)
    .name('elevation')
gui.add(cubeMaterial, 'wireframe')
scene.add(cubeMesh)

/**
 * Axes Helper
 */
const axesHelper = new AxesHelper(2)
scene.add(axesHelper)

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

// Camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

let renderer: WebGLRenderer

onMounted(() => {
    // Renderer
    renderer = new WebGLRenderer({
        canvas: screenContainer.value
    })
    renderer.setSize(sizes.width, sizes.height)

    // Controls
    const controls = new OrbitControls(camera, screenContainer.value)
    controls.enableDamping = true
    /**
     * Animate
     */
    const clock = new Clock()
    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
        // camera.position.y = cursor.y * 3
        // camera.lookAt(cubeMesh.position)
        controls.update()
        // Render
        renderer.render(scene, camera)
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    renderer.outputColorSpace = LinearSRGBColorSpace
    tick()
})

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (screenContainer.value.requestFullscreen) {
            screenContainer.value.requestFullscreen()
        }
        else if (screenContainer.value.webkitRequestFullscreen) {
            screenContainer.value.webkitRequestFullscreen()
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})

</script>