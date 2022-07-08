import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import type { mapOptions, position } from './interfaces'
import type { Display } from 'rot-js'
export class Diesel {
    canvas: any
    ctx: CanvasRenderingContext2D
    dieselAnimation: any
    display: Display
    locked: boolean
    map: Array<Array<number>>
    mapSize: mapOptions
    mapScreenSize: mapOptions
    playerPoisiton: position
    spriteSheet: HTMLImageElement
    spriteSize: number
    timer: number
    constructor(canvas: any) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.locked = true
        this.mapSize = { height: 500, width: 500 }
        this.map = this.makeMap(this.mapSize)
        this.spriteSize = 21
        this.mapScreenSize = this.setMapScreenSize()
        this.playerPoisiton = { x: 25, y: 25 }
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
    getOffsets(): position {
        let topLeftX = Math.max(0, this.playerPoisiton.x - Math.floor(this.mapScreenSize.width / 2))
        topLeftX = Math.min(topLeftX, this.mapSize.width - this.mapScreenSize.width)
        let topLeftY = Math.max(0, this.playerPoisiton.y - Math.floor(this.mapScreenSize.height / 2))
        topLeftY = Math.min(topLeftY, this.mapSize.height - this.mapScreenSize.height)
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
        const { height, width } = this.mapSize;
        const tileCollection = []
        for (let x = 0; x < width; x++) {
            tileCollection.push([]);
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
    setMapScreenSize(): mapOptions {
        const mapHeight = Math.floor(this.canvas.height / this.spriteSize)
        const mapWidth = Math.floor(this.canvas.width / this.spriteSize)
        return {
            height: mapHeight % 2 === 0 ? mapHeight - 1 : mapHeight,
            width: mapWidth % 2 === 0 ? mapWidth - 1 : mapWidth
        }
    }
    drawMap(): string {
        //done
        // after getting total tiles vs this.canvas w / h (make it always odd / odd) so player at center unless out of context. have it set on init / and resize, only needed if screensize changes.
        // so you get the player position, get the total tiles, if it is greater or === to the edge of the map / place player in center else place player off center of total Tiles
        // get upper left position for context of what to draw vs total tiles / player postion (center / off center), 
        // math map for loop
        const offsets = this.getOffsets();
        let mapx = Math.floor((this.canvas.width - this.mapScreenSize.width * this.spriteSize) / 2)
        for (let x = offsets.x; x < offsets.x + this.mapScreenSize.width; x++) {
            let mapy = Math.floor((this.canvas.height - this.mapScreenSize.height * this.spriteSize) / 2)
            for (let y = offsets.y; y < offsets.y + this.mapScreenSize.height; y++) {
                // rework this logic 
                if (!(x === this.playerPoisiton.x) || !(y === this.playerPoisiton.y)) {
                    if (this.map[x][y] === 0) this.drawSprite(".", { x: mapx, y: mapy }, "#1d1d1d", "white", this.spriteSize)
                    if (this.map[x][y] === 1) this.drawSprite("#", { x: mapx, y: mapy }, "purple", "white", this.spriteSize)
                } else {
                    this.drawSprite("@", { x: mapx, y: mapy }, "#1d1d1d", "yellow", this.spriteSize)
                }
                mapy += this.spriteSize
            }
            mapx += this.spriteSize
        }

        //todo
        // draw tiles only if they need 2 update
        // draw map center screen
        // draw entity / player is a function that only switches to source-atop and draws colored rect 
        // draw order actor / prop / scene
        // draw all three in one pass. no draw over

        return "a map drawn"
    }
    drawSprite(type: string, pos: position, bg: string, fg: string, size: number): void {

        // todo break this into 3 seperate functions, drawSprite handles one, draw sprites handles many 
        const char: position = convertChar(type)
        // draw image, sx, sy, sw, sh, dx, dy, dw, dh
        this.ctx.drawImage(this.spriteSheet,
            18 * char.x, 18 * char.y, 21, 21,
            pos.x, pos.y, size, size)
        /*
             // draw fg color
         this.ctx.globalCompositeOperation = 'source-atop'
         this.ctx.fillStyle = fg
         this.ctx.fillRect(pos.x, pos.y, size, size)
 
         // draw bg color
         this.ctx.globalCompositeOperation = "destination-over"
         this.ctx.fillStyle = bg
         this.ctx.fillRect(pos.x, pos.y, size, size)
 
         // reset composite mode
         this.ctx.globalCompositeOperation = "source-over"
        */
    }
    tick(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        /**
         * Demo draw
         */
        this.drawMap()
    }
    /**
     * Start Engine
     */
    init(): void {
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
        //window.addEventListener("pointermove", (e) => {
        //    console.log("setting mouse")
        //})        const offsets = this.renderGetOffsets();
        /**
         * Resize and redraw
         */
        window.addEventListener("resize", () => {
            cancelAnimationFrame(this.dieselAnimation)
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.mapScreenSize = this.setMapScreenSize()
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
