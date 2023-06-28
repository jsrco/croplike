<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AmbientLight, AxesHelper, BoxGeometry, BufferAttribute, BufferGeometry, Clock, Color, ColorManagement, DoubleSide, LinearSRGBColorSpace, LoadingManager, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshStandardMaterial, MeshToonMaterial, NearestFilter, OrthographicCamera, PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping, Scene, SphereGeometry, Texture, TextureLoader, TorusGeometry, WebGLRenderer } from 'three'
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
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')



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

const material = new MeshStandardMaterial()
// material.map = doorColorTexture
material.metalness = 0.45
material.roughness = 0.65
material.transparent = true
material.side = DoubleSide
material.wireframe = false

const sphere = new Mesh(
    new SphereGeometry(0.5, 16, 16),
    material
)
sphere.position.x = - 1.5

const plane = new Mesh(
    new PlaneGeometry(1, 1),
    material
)

const torus = new Mesh(
    new TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)


/**
 * Axes Helper
 */
const axesHelper = new AxesHelper(2)
scene.add(axesHelper)

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xFFA500, 0.75)
scene.add(ambientLight)


const pointLight = new PointLight(0x0000FF, 1.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime
        plane.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime

        sphere.rotation.x = 0.15 * elapsedTime
        plane.rotation.x = 0.15 * elapsedTime
        torus.rotation.x = 0.15 * elapsedTime
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