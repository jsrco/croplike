import * as PIXI from 'pixi.js'
import { GameScreen } from "./gameScreen"
import { clickedObject, createGrid, mapScreen } from "./mapScreen"
import useScreen from "../composeables/useScreen"
import { Entity } from './entity'
import { ref } from 'vue'

PIXI.settings.SCALE_MODE = 0

const npcPath = ref(0)

export const actionScreen: GameScreen = new GameScreen({ appOptions: { width: window.innerWidth, height: window.innerHeight - 36, }, stageName: 'actionScreen' })

const style = new PIXI.TextStyle({
    fontFamily: 'PixiPressStart2P',
    fontSize: 16,
    fill: ['#fff'],
})


export let createAction: FrameRequestCallback

PIXI.Assets.load('../assets/ff5x5.json').then(() => {
    // create an array to store the textures
    const texture = PIXI.Texture.from(`ff5x5 357.png`)

    const player = new Entity(new PIXI.Sprite(texture), 'player')
    const entities = [player]

    for (let i = 0; i <= 149; i++) {
        entities.push(new Entity(new PIXI.Sprite(texture), 'npc'))
    }

    const onKeyDown = (key: { keyCode: number }) => {
        if (useScreen().Screen.value?.stageName === 'actionScreen') {
            // A Key is 65
            // Left arrow is 37
            if (key.keyCode === 65 || key.keyCode === 37) {
                // If the A key or the Left arrow is pressed, move the player to the left.
                player.moveLeft()
            }
            // D Key is 68
            // Right arrow is 39
            if (key.keyCode === 68 || key.keyCode === 39) {
                // If the D key or the Right arrow is pressed, move the player to the right.
                player.moveRight()
            }
            if (key.keyCode === 87 || key.keyCode === 38) {
                // If the W key or the Up arrow is pressed, move the player up.
                if (player.hanging) player.wallJump()
                else player.jump()
            }
        }
    }
    document.addEventListener('keydown', onKeyDown)

    createAction = () => {
        actionScreen.stage.removeChildren()

        const richText = new PIXI.Text('action screen', style);
        richText.x = 10
        richText.y = 10
        actionScreen.stage.addChild(richText)
        const poorText = new PIXI.Text(`Grid: ${clickedObject.value.shapeNumber}\nPosition: ${clickedObject.value.position}\nType:${clickedObject.value.type}`, style);
        poorText.x = 10
        poorText.y = 30
        actionScreen.stage.addChild(poorText)

        actionScreen.stage.interactive = true;
        actionScreen.stage.hitArea = actionScreen.screen;
        actionScreen.stage.on('pointerup', (event) => {
            //handle event
            useScreen(mapScreen)
            mapScreen.render()
            requestAnimationFrame(createGrid)
        })

        for (let entity of entities) {
            if (entity.name !== 'player') {
                entity.maxSpeed = 1
                entity.square.x = Math.floor(Math.random() * (300 - 200 + 1) + 200)
                entity.square.y = window.innerHeight - entity.size - 36
                entity.square.tint = parseInt(Math.floor(Math.random() * 16777215).toString(16), 16)
                actionScreen.stage.addChild(entity.square)
            }
        }


        player.square.x = 0
        player.square.y = window.innerHeight - player.size - 36
        actionScreen.stage.addChild(player.square)

        actionScreen.ticker.add((delta) => {
            for (let npc of entities) {
                if (npc.name !== 'player') {
                    if (npc.path < 200) {
                        npc.moveLeft()
                        npc.path++
                        if (npc.path === 200) npc.path = 400
                    } else if (npc.path > 201) {
                        npc.moveRight()
                        npc.path--
                        if (npc.path === 201) npc.path = 0
                    }
                    npc.update(entities)
                }
            }
            player.update(entities)
        })
        actionScreen.render()
    }
})