import { Display } from 'rot-js'
import { Screen } from './screen'
import { writable } from 'svelte/store'
import { TileMap } from './tileMap'
const dieselEngine = writable({
    canvas: null,
    currentScreen: null,
    cursorInfo: String,
    dieselAnimation: null,
    display: null,
    locked: null,
    playerPosition: null,
    screen: null,
    screenSize: null,
    spriteSheet: null,
    spriteSize: null,
    loadImage(src) {
        return new Promise((resolve, reject) => {
            this.spriteSheet = new Image()
            this.spriteSheet.onload = () => resolve(this.spriteSheet)
            this.spriteSheet.onerror = reject
            this.spriteSheet.src = src
        })
    },
    refresh(): void {
        this.display.clear()
        this.currentScreen.render(this.display)
        this.dieselAnimation = requestAnimationFrame(this.refresh.bind(this))
    },
    setScreenSize() {
        const mapHeight = Math.floor(window.innerHeight / this.spriteSize)
        const mapWidth = Math.floor(window.innerWidth / this.spriteSize)
        return {
            height: mapHeight % 2 === 0 ? mapHeight - 1 : mapHeight,
            width: mapWidth % 2 === 0 ? mapWidth - 1 : mapWidth
        }
    },    
    init(gameContainer: any) {
        this.loadImage('assets/ff5x5.png').then(image => {
            console.log(image, 'loaded')
        })
        this.dieselAnimation = requestAnimationFrame(this.refresh.bind(this))
        this.spriteSize = 21
        this.display = new Display({
            layout: 'tile-gl',
            bg: '#1d1d1d',
            forceSquareRatio: true,
            fontFamily: 'PressStart2P',
            fontSize: this.spriteSize,
            tileSet: this.spriteSheet,
            tileMap: TileMap,
            tileWidth: this.spriteSize,
            tileHeight: this.spriteSize,
            tileColorize: true
        })
        this.cursorInfo = 'no cursor info',
        this.screenSize = this.setScreenSize()
        this.display.setOptions(this.screenSize)
        gameContainer.appendChild(this.display.getContainer())
        this.canvas = gameContainer.firstChild
        this.screen = Screen
        window.addEventListener('dblclick', () => {
            const fullscreenElement =
                document.fullscreenElement || document.webkitFullscreenElement
            if (!fullscreenElement) {
                if (gameContainer.requestFullscreen) {
                    gameContainer.requestFullscreen()
                } else if (this.canvas.webkitRequestFullscreen) {
                    gameContainer.webkitRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                }
            }
        })
        const bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                if (this.currentScreen !== null) {
                    this.currentScreen.handleInput(event, e)
                }
            })
        }
        bindEventToScreen('click')
        bindEventToScreen('pointermove')
        bindEventToScreen('keydown')
        bindEventToScreen('keepress')
        /*
        window.addEventListener('pointermove', (e) => {
            console.log('setting mouse')
        })        
        */
        window.addEventListener('resize', () => {
            cancelAnimationFrame(this.dieselAnimation)
            this.screenSize = this.setScreenSize()
            this.display.setOptions(this.screenSize)
            this.refresh()
        })
        Game.switchScreen(this.screen.startScreen)
    }
})
export const Game = {
    subscribe: dieselEngine.subscribe,
    refresh: () => {
        dieselEngine.update(self => {
            self.refresh()
            return self
        })
    },
    switchScreen: (screen: any) => {
        dieselEngine.update(self => {
            if (self.currentScreen !== null) {
                self.currentScreen.exit()
            }
            self.display.clear()
            self.currentScreen = screen
            if (!self.currentScreen !== null) {
                self.currentScreen.enter()
                self.refresh()
            }
            return self
        })
    },
    updateCursor: (description) => {
        dieselEngine.update(self => {
            self.cursorInfo = description
            return self
        })
    },
}