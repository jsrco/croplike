<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { AxesHelper, Clock, Color, ColorManagement, LinearSRGBColorSpace, LoadingManager, Mesh, MeshBasicMaterial, MeshMatcapMaterial, PerspectiveCamera, Scene, TextureLoader, TorusGeometry, WebGLRenderer } from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
// const gui = new dat.GUI()

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
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
let text
fontLoader.load(
    '/src/assets/fonts/Press Start 2P_Regular.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Ryan Orlando',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()
        const textMaterial = new MeshMatcapMaterial({ matcap: matcapTexture })
        text = new Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)

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

/**
 * Axes Helper
 */
const axesHelper = new AxesHelper(2)
scene.add(axesHelper)

const donutGeometry = new TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new MeshMatcapMaterial({ matcap: matcapTexture })

for (let i = 0; i < 100; i++) {

    const donut = new Mesh(donutGeometry, donutMaterial)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut)
}

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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 7
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