import type { displayOptions } from './interfaces'
import { Display } from 'rot-js'
import { Screen } from './screen'
import { writable } from 'svelte/store'
import { TileMap } from './tileMap'

const dieselEngine = writable({
    canvas: null,
    currentScreen: null,
    dieselAnimation: null,
    display: null,
    locked: null,
    playerPosition: null,
    screenSize: null,
    spriteSheet: null,
    spriteSize: null,
    /**
     * Engine Mechanics
     */
    EngineLock(tracking: string): void {
        if (!this.locked)
            this.locked = true
        else
            console.log(`::failed::\n    ${tracking}\n    Game already locked. You should not be trying the action.`)
    },
    EngineUnlock(tracking: string, action: () => void): void {
        if (this.locked) {
            this.locked = false
            this.EngineUpdate(tracking, action)
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game already unlocked. You should not be trying the action.`)
    },
    EngineUpdate(tracking: string, action: () => void): void {
        if (!this.locked) {
            // actions handle any game updates and will lock the game accordingly. 
            action()
            this.EngineLock(tracking)
            console.log(`::succeeded::\n    ${tracking}\n    Game has been updated.`)
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game is locked. You should not be trying to update the engine.`)
    },
    /**
     *  Visual Setup
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            this.spriteSheet = new Image()
            this.spriteSheet.onload = () => resolve(this.spriteSheet)
            this.spriteSheet.onerror = reject
            this.spriteSheet.src = src
        })
    },
    setScreenSize(): displayOptions {
        const mapHeight = Math.floor(window.innerHeight / this.spriteSize)
        const mapWidth = Math.floor(window.innerWidth / this.spriteSize)
        return {
            height: mapHeight % 2 === 0 ? mapHeight - 1 : mapHeight,
            width: mapWidth % 2 === 0 ? mapWidth - 1 : mapWidth
        }
    },
    masterRender(): void {
        this.display.clear()
        /**
         * Demo draw
         */
        this.currentScreen.render(this.display)
        this.dieselAnimation = requestAnimationFrame(this.masterRender.bind(this))
    },
    /**
     * Start Engine
     */
    init(gameContainer: any) {
        this.loadImage('assets/ff5x5.png').then(image => {
            console.log(image, 'loaded')
        })
        this.dieselAnimation = requestAnimationFrame(this.masterRender.bind(this))
        this.spriteSize = 21
        this.display = new Display({
            layout: 'tile-gl',
            bg: 'transparent',
            forceSquareRatio: true,
            fontFamily: 'PressStart2P',
            fontSize: this.spriteSize,
            tileSet: this.spriteSheet,
            tileMap: TileMap,
            tileWidth: this.spriteSize,
            tileHeight: this.spriteSize,
            tileColorize: true
        })
        this.screenSize = this.setScreenSize()
        this.display.setOptions(this.screenSize)
        gameContainer.appendChild(this.display.getContainer())
        this.canvas = gameContainer.firstChild
        this.playerPosition = { x: 25, y: 25 }
        this.screen = Screen
        /**
       * Fullscreen
       */
        window.addEventListener('dblclick', () => {
            const fullscreenElement =
                document.fullscreenElement || document.webkitFullscreenElement
            if (!fullscreenElement) {
                if (this.canvas.requestFullscreen) {
                    this.canvas.requestFullscreen()
                } else if (this.canvas.webkitRequestFullscreen) {
                    this.canvas.webkitRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                }
            }
        })
        /**
         * Handle Input
         */
        const bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                // When an event is received, send it to the
                // screen if there is one
                if (this.currentScreen !== null) {
                    // Send the event type and data to the screen
                    this.currentScreen.handleInput(event, e)
                }
            })
        }
        bindEventToScreen('click')
        bindEventToScreen('mousemove')
        bindEventToScreen('keydown')
        /**
         * Mouse Tracking
         */
        /*
        window.addEventListener('pointermove', (e) => {
            console.log('setting mouse')
        })        
        */
        /**
         * Resize and redraw
         */
        window.addEventListener('resize', () => {
            cancelAnimationFrame(this.dieselAnimation)
            this.screenSize = this.setScreenSize()
            this.display.setOptions(this.screenSize)
            this.masterRender()
        })
        /**
         * Init Game
         */
        //this.tick()
        Game.switchScreen(this.screen.startScreen)
    },
    /**
     * Test Function
     */
    test(tracking: string, action: () => void): void {
        this.EngineUnlock(tracking, action)
    }
})

export const Game = {
    subscribe: dieselEngine.subscribe,
    switchScreen: (screen: any) => {
        dieselEngine.update(self => {
            // If we had a screen before, notify it that we exited
            if (self.currentScreen !== null) {
                self.currentScreen.exit()
            }
            // Clear the display
            self.display.clear()
            // Update our current screen, notify it we entered
            // and then render it
            self.currentScreen = screen
            if (!self.currentScreen !== null) {
                self.currentScreen.enter()
                self.masterRender()
            }
            return self
        })
    }
}


