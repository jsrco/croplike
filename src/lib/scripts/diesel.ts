import { ColorSwatch } from './colorSwatch'
import { TileMap } from './tileMap'
import { Color, Display } from 'rot-js'
import type { mapOptions, position } from './interfaces'
export class Diesel {
    canvas: any
    currentScreen: any
    dieselAnimation: any
    display: Display
    locked: boolean
    map: Array<Array<number>>
    mapSize: mapOptions
    playerPosition: position
    screenSize: mapOptions
    spriteSheet: HTMLImageElement
    spriteSize: number
    constructor(gameContainer: any) {
        this.loadImage("assets/ff5x5.png").then(image => {
            console.log(image)
        })
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.spriteSize = 21
        this.display = new Display({
            layout: "tile-gl",
            bg: "transparent",
            forceSquareRatio: true,
            fontFamily: "PressStart2P",
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
        this.mapSize = { height: 500, width: 500 }
        this.map = this.makeMap(this.mapSize)
        this.playerPosition = { x: 25, y: 25 }
        this.init()

    }
    /**
     * Engine Mechanics
     */
    #EngineLock(tracking: string): void {
        if (!this.locked)
            this.locked = true
        else
            console.log(`::failed::\n    ${tracking}\n    Game already locked. You should not be trying the action.`)
    }
    #EngineUnlock(tracking: string, action: () => void): void {
        if (this.locked) {
            this.locked = false
            this.#EngineUpdate(tracking, action)
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game already unlocked. You should not be trying the action.`)
    }
    #EngineUpdate(tracking: string, action: () => void): void {
        if (!this.locked) {
            // actions handle any game updates and will lock the game accordingly. 
            action()
            this.#EngineLock(tracking)
            console.log(`::succeeded::\n    ${tracking}\n    Game has been updated.`)
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game is locked. You should not be trying to update the engine.`)
    }
    /**
     * Handle Input
     */
    handleInput(inputType, inputData): void {
        if (inputType === "keydown") {
            // West
            if (inputData.key === "ArrowLeft") {
                this.playerPosition.x--
            }
            // East
            else if (inputData.key === "ArrowRight") {
                this.playerPosition.x++
            }
            // North
            else if (inputData.key === "ArrowUp") {
                this.playerPosition.y--
            }
            // South
            else if (inputData.key === "ArrowDown") {
                this.playerPosition.y++
            }
            // North West
            else if (inputData.keyCode === 36) {
                this.playerPosition.x--
                this.playerPosition.y--
            }
            // North East
            else if (inputData.keyCode === 33)  {
                this.playerPosition.x++
                this.playerPosition.y--
            }
            // South East
            else if (inputData.keyCode === 34)  {
                this.playerPosition.x++
                this.playerPosition.y++
            }
            // South West
            else if (inputData.keyCode === 35) {
                this.playerPosition.x--
                this.playerPosition.y++
            }
            console.log(this.playerPosition)
        }
    }
    /**
     * Animate Game
     */
    drawMap(): string {
        //done
        // after getting total tiles vs this.canvas w / h (make it always odd / odd) so player at center unless out of context. have it set on init / and resize, only needed if screensize changes.
        // so you get the player position, get the total tiles, if it is greater or === to the edge of the map / place player in center else place player off center of total Tiles
        // get upper left position for context of what to draw vs total tiles / player postion (center / off center), 
        // math map for loop

        const offsets = this.getOffsets();
        for (let x = 0; x < this.screenSize.width; x++) {
            for (let y = 0; y < this.screenSize.height; y++) {
                if (offsets.x+x === this.playerPosition.x && offsets.y+y === this.playerPosition.y) {
                    this.display.draw(
                        x,
                        y,
                        "@",
                        "orange",
                        "blue"
                    )
                } else {
                    if (this.map[offsets.x+x][offsets.y+y] === 1) this.display.draw(
                        x,
                        y,
                        "#",
                        "orange",
                        "red"
                    )
                    if (this.map[offsets.x+x][offsets.y+y] === 0) this.display.draw(
                        x,
                        y,
                        ".",
                        "orange",
                        "red"
                    )
                }
            }
        }
        //todo
        // create display for rot.js introudction to remove our own draw. 
        // adjust implemented code to support rot.js again
        // consildate
        // massive knowledge gain achieved 
        // draw tiles only if they need 2 update
        // draw map center screen
        // draw entity / player is a function that only switches to source-atop and draws colored rect 
        // draw order actor / prop / scene
        // draw all three in one pass. no draw over

        return "a map drawn"
    }
    getOffsets(): position {
        let topLeftX = Math.max(0, this.playerPosition.x - Math.floor(this.screenSize.width / 2))
        topLeftX = Math.min(topLeftX, this.mapSize.width - this.screenSize.width)
        let topLeftY = Math.max(0, this.playerPosition.y - Math.floor(this.screenSize.height / 2))
        topLeftY = Math.min(topLeftY, this.mapSize.height - this.screenSize.height)
        return {
            x: topLeftX,
            y: topLeftY,
        }
    }
    loadImage(src) {
        return new Promise((resolve, reject) => {
            this.spriteSheet = new Image()
            this.spriteSheet.onload = () => resolve(this.spriteSheet)
            this.spriteSheet.onerror = reject
            this.spriteSheet.src = src
        })
    }
    makeMap(mapOption: mapOptions) {
        const { height, width } = this.mapSize
        const tileCollection = []
        for (let x = 0; x < width; x++) {
            tileCollection.push([])
            for (let y = 0; y < height; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === width - 1 ||
                    y === height - 1 ||
                    (x % 4 === 0 && y % 4 === 0)
                ) {
                    tileCollection[x][y] = 1
                } else {
                    tileCollection[x][y] = 0
                }
            }
        }
        return tileCollection
    }
    setScreenSize(): mapOptions {
        const mapHeight = Math.floor(window.innerHeight / this.spriteSize)
        const mapWidth = Math.floor(window.innerWidth / this.spriteSize)
        return {
            height: mapHeight % 2 === 0 ? mapHeight - 1 : mapHeight,
            width: mapWidth % 2 === 0 ? mapWidth - 1 : mapWidth
        }
    }
    tick(): void {
        this.display.clear()
        /**
         * Demo draw
         */
        this.drawMap()
        // this.currentScreen.render(this.display);

        // this.drawMap()
        // todo 
        // implement animation loop
        // built off boolean of engine updating 
        // add to resize if need
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
    }
    /**
     * Start Engine
     */
    init(): void {
        /**
       * Fullscreen
       */
        window.addEventListener("dblclick", () => {
            const fullscreenElement =
                document.fullscreenElement || document.webkitFullscreenElement;
            if (!fullscreenElement) {
                if (this.canvas.requestFullscreen) {
                    this.canvas.requestFullscreen();
                } else if (this.canvas.webkitRequestFullscreen) {
                    this.canvas.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });
        /**
         * Handle Input
         */
        const bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                this.handleInput(event, e)
            })
        }
        bindEventToScreen("mousemove")
        bindEventToScreen("keydown")
        /**
         * Mouse Tracking
         */
        /*
        window.addEventListener("pointermove", (e) => {
            console.log("setting mouse")
        })        
        */
        /**
         * Resize and redraw
         */
        window.addEventListener("resize", () => {
            cancelAnimationFrame(this.dieselAnimation)
            this.screenSize = this.setScreenSize()
            this.display.setOptions(this.screenSize)
            this.tick()
        })
        /**
         * Init Game
         */
        this.tick()
    }
    /**
     * Test Function
     */
    test(tracking: string, action: () => void): void {
        this.#EngineUnlock(tracking, action)
    }
}
