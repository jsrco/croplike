<template>
    <canvas ref="screenContainer" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AxesHelper, BoxGeometry, BufferAttribute, BufferGeometry, Clock, Color, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from 'three'

const screenContainer = ref()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new Scene()
scene.background = new Color('#1d1d1d') // Set black background color
// Object
//const cubeGeometry = new SphereGeometry(1)
const cubeGeometry = new BufferGeometry()
// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}
// Create the attribute and name it 'position'
const positionsAttribute = new BufferAttribute(positionsArray, 3)
cubeGeometry.setAttribute('position', positionsAttribute)

const cubeMaterial = new MeshBasicMaterial({
    color: '#ff0000',
    wireframe: true,
})
const cubeMesh = new Mesh(cubeGeometry, cubeMaterial)
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