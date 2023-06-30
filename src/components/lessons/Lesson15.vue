<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AmbientLight, BoxGeometry, Clock, Color, ColorManagement, DirectionalLight, DirectionalLightHelper, HemisphereLight, LinearSRGBColorSpace, LoadingManager, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, RectAreaLight, Scene, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, TorusGeometry, Vector3, WebGLRenderer } from 'three'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
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

const screenContainer = ref()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

ColorManagement.enabled = false

// Scene
const scene = new Scene()
scene.background = new Color('#1d1d1d') // Set background color

/**
 * Lights
 */
// const ambientLight = new AmbientLight()
// ambientLight.color = new Color(0xffffff)
// ambientLight.intensity = 0.5
// scene.add(ambientLight)


// const directionalLight = new DirectionalLight(0xff0ff0, 0.3)
// scene.add(directionalLight)
// directionalLight.position.set(1, 0.25, 0)

// const hemisphereLight = new HemisphereLight(0xff0000, 0x000000, 0.53)
// scene.add(hemisphereLight)

// const pointLight = new PointLight(0xff9000,  0.5, 5, 6)
// scene.add(pointLight)
// pointLight.position.set(1, - 0.5, 1)

// const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1)
// scene.add(rectAreaLight)
// rectAreaLight.position.set(- 1.5, 0, 1.5)
// rectAreaLight.lookAt(new Vector3())

const directionalLight = new DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0, 1, 0)
scene.add(directionalLight)

// const spotLight = new SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
// spotLight.position.set(0, 2, 3)
// scene.add(spotLight)
// spotLight.target.position.x = - 1.15
// scene.add(spotLight.target)

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

const directionalLightHelper = new DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)

// const spotLightHelper = new SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)
/**
 * Objects
 */
// Material
const material = new MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new Mesh(
    new SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new Mesh(
    new BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new Mesh(
    new TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new Mesh(
    new PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
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
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime
        cube.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime

        sphere.rotation.x = 0.15 * elapsedTime
        cube.rotation.x = 0.15 * elapsedTime
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