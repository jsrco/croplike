import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import { Color, Display } from 'rot-js'
import type { mapOptions, position } from './interfaces'
export class Diesel {
    canvas: any
    dieselAnimation: any
    display: Display
    locked: boolean
    map: Array<Array<number>>
    mapSize: mapOptions
    playerPoisiton: position
    screenSize: mapOptions
    spriteSheet: HTMLImageElement
    spriteSize: number
    timer: number
    constructor(gameContainer: any) {
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.spriteSize = 21
        this.display = new Display({
            bg: "transparent",
            forceSquareRatio: true,
            fontFamily: "PressStart2P",
            fontSize: this.spriteSize
        })
        this.screenSize = this.setScreenSize()
        this.display.setOptions(this.screenSize)
        gameContainer.appendChild(this.display.getContainer())
        this.canvas = gameContainer.firstChild
        /*
        this.mapSize = { height: 500, width: 500 }
        this.map = this.makeMap(this.mapSize)
        this.playerPoisiton = { x: 25, y: 25 }
        */
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
            if (inputData.key === "ArrowLeft") this.test("left", () => {
                this.playerPoisiton.x--
                this.tick()
            })
            // East
            else if (inputData.key === "ArrowRight") this.test("right", () => {
                this.playerPoisiton.x++
                this.tick()
            })
            // North
            else if (inputData.key === "ArrowUp") this.test("up", () => {
                this.playerPoisiton.y--
                this.tick()
            })
            // South
            else if (inputData.key === "ArrowDown") this.test("down", () => {
                this.playerPoisiton.y++
                this.tick()
            })
            // North West
            else if (inputData.keyCode === 36) this.test("up left", () => {
                this.playerPoisiton.x--
                this.playerPoisiton.y--
                this.tick()
            })
            // North East
            else if (inputData.keyCode === 33) this.test("up right", () => {
                this.playerPoisiton.x++
                this.playerPoisiton.y--
                this.tick()
            })
            // South East
            else if (inputData.keyCode === 34) this.test("down right ", () => {
                this.playerPoisiton.x++
                this.playerPoisiton.y++
                this.tick()
            })
            // South West
            else if (inputData.keyCode === 35) this.test("down left", () => {
                this.playerPoisiton.x--
                this.playerPoisiton.y++
                this.tick()
            })
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
        const offsets = this.getOffsets()
        let mapx = Math.floor((window.innerWidth - this.screenSize.width * this.spriteSize) / 2)
        for (let x = offsets.x; x < offsets.x + this.screenSize.width; x++) {
            let mapy = Math.floor((window.innerHeight - this.screenSize.height * this.spriteSize) / 2)
            for (let y = offsets.y; y < offsets.y + this.screenSize.height; y++) {
                // rework this logic 
                mapy += this.spriteSize
            }
            mapx += this.spriteSize
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
        let topLeftX = Math.max(0, this.playerPoisiton.x - Math.floor(this.screenSize.width / 2))
        topLeftX = Math.min(topLeftX, this.mapSize.width - this.screenSize.width)
        let topLeftY = Math.max(0, this.playerPoisiton.y - Math.floor(this.screenSize.height / 2))
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
         let foreground, background, colors;
         for (let i = 0; i < 15; i++) {
             // Calculate the foreground color, getting progressively darker
             // and the background color, getting progressively lighter.
             foreground = Color.toRGB([255 - (i*20),
                                           255 - (i*20),
                                           255 - (i*20)]);
             background = Color.toRGB([i*20, i*20, i*20]);
             // Create the color format specifier.
             colors = "%c{" + foreground + "}%b{" + background + "}";
             // Draw the text at col 2 and row i
             this.display.drawText(2, i, colors + "Hello, world!");
         }

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
        this.loadImage("assets/ff5x5.png").then(image => {
            this.tick()
        })
    }
    /**
     * Test Function
     */
    test(tracking: string, action: () => void): void {
        this.#EngineUnlock(tracking, action)
    }
}
