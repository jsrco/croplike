import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import type { position } from './interfaces'
export class Diesel {
    canvas: any
    ctx: CanvasRenderingContext2D
    dieselAnimation: any
    locked: boolean
    map: Array<Array<number>>
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
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.locked = true
        this.map = this.makeMap(500, 500)
        this.spriteSheet = new Image()
        this.spriteSheet.src = 'assets/ff5x5.png'
        this.spriteSheet.style.imageRendering = "pixelated";
        this.spriteSize = 21
        this.playerPoisiton = { x: 157, y: 73 }
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
                this.playerPoisiton.x -= this.spriteSize
            })
            // East
            else if (inputData.key === "ArrowRight") this.test("right", () => {
                this.playerPoisiton.x += this.spriteSize
            })
            // North
            else if (inputData.key === "ArrowUp") this.test("up", () => {
                this.playerPoisiton.y -= this.spriteSize
            })
            // South
            else if (inputData.key === "ArrowDown") this.test("down", () => {
                this.playerPoisiton.y += this.spriteSize
            })
            // North West
            else if (inputData.keyCode === 36) this.test("up left", () => {
                this.playerPoisiton.x -= this.spriteSize
                this.playerPoisiton.y -= this.spriteSize
            })
            // North East
            else if (inputData.keyCode === 33) this.test("up right", () => {
                this.playerPoisiton.x += this.spriteSize
                this.playerPoisiton.y -= this.spriteSize
            })
            // South East
            else if (inputData.keyCode === 34) this.test("down right ", () => {
                this.playerPoisiton.x += this.spriteSize
                this.playerPoisiton.y += this.spriteSize
            })
            // South West
            else if (inputData.keyCode === 35) this.test("down left", () => {
                this.playerPoisiton.x -= this.spriteSize
                this.playerPoisiton.y += this.spriteSize
            })
        }
    }
    /**
     * Animate Game
     */
    makeMap(height: number, width: number) {
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
    drawMap(): string {
        // after getting total tiles vs this.canvas w / h (make it always odd / odd) so player at center unless out of context. have it set on init / and resize, only needed if screensize changes.
        // so you get the player position, get the total tiles, if it is greater or === to the edge of the map / place player in center else place player off center of total Tiles
        // get upper left position for context of what to draw vs total tiles / player postion (center / off center), 
        // math map for loop
        // draw tiles only if they need 2 update
        // draw map center screen
        // draw entity / player is a function that only switches to source-atop and draws colored rect 
        // draw order actor / prop / scene
        // draw all three in one pass. no draw over
        
        return "a map drawn"
    }
    drawSprite(type: string, pos: position, bg: string, fg: string, size: number): void {
        const char: position = convertChar(type)
        // draw image, sx, sy, sw, sh, dx, dy, dw, dh
        this.ctx.drawImage(this.spriteSheet,
            18 * char.x, 18 * char.y, 21, 21,
            pos.x, pos.y, size, size)
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
    }
    /* renderGetOffsets() {
        const { height, width } = this.displayOptions;
        const { pos } = this.player;
        let topLeftX = Math.max(0, pos[0].x - width / 2);
        topLeftX = Math.min(topLeftX, this.map.mapWidth - width);
        let topLeftY = Math.max(0, pos[0].y - height / 2);
        topLeftY = Math.min(topLeftY, this.map.mapHeight - height);
        return {
            x: topLeftX,
            y: topLeftY,
        };
    } */
    tick(): void {
        if (this.locked) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            /**
             * Demo draw
             */
            this.drawSprite("#", { x: 10, y: 10 }, "orange", "white", this.spriteSize)
            this.drawSprite("sThick", { x: 10, y: 31 }, "orange", "white", this.spriteSize)
            this.drawSprite("oLower", { x: 10, y: 52 }, "orange", "white", this.spriteSize)
            this.drawSprite("rFull", { x: 10, y: 73 }, "orange", "white", this.spriteSize)
            this.drawSprite("#", { x: 10, y: 94 }, "orange", "white", this.spriteSize)


            this.drawSprite("#", { x: 31, y: 10 }, "salmon", "white", this.spriteSize)
            this.drawSprite("uFull", { x: 31, y: 31 }, "salmon", "white", this.spriteSize)
            this.drawSprite("fFancy", { x: 31, y: 52 }, "salmon", "white", this.spriteSize)
            this.drawSprite("aThick", { x: 31, y: 73 }, "salmon", "white", this.spriteSize)
            this.drawSprite("#", { x: 31, y: 94 }, "salmon", "white", this.spriteSize)

            this.drawSprite("#", { x: 52, y: 10 }, "pink", "white", this.spriteSize)
            this.drawSprite("mLower", { x: 52, y: 31 }, "pink", "white", this.spriteSize)
            this.drawSprite(".", { x: 52, y: 52 }, "pink", "white", this.spriteSize)
            this.drawSprite("gFull", { x: 52, y: 73 }, "pink", "white", this.spriteSize)
            this.drawSprite("#", { x: 52, y: 94 }, "pink", "white", this.spriteSize)

            this.drawSprite("#", { x: 73, y: 10 }, "yellow", "white", this.spriteSize)
            this.drawSprite("mUpper", { x: 73, y: 31 }, "yellow", "white", this.spriteSize)
            this.drawSprite(".", { x: 73, y: 52 }, "yellow", "white", this.spriteSize)
            this.drawSprite("eLower", { x: 73, y: 73 }, "yellow", "white", this.spriteSize)
            this.drawSprite("#", { x: 73, y: 94 }, "yellow", "white", this.spriteSize)

            this.drawSprite("#", { x: 94, y: 10 }, "blue", "white", this.spriteSize)
            this.drawSprite("eFull", { x: 94, y: 31 }, "blue", "white", this.spriteSize)
            this.drawSprite(".", { x: 94, y: 52 }, "blue", "white", this.spriteSize)
            this.drawSprite(".", { x: 94, y: 73 }, "blue", "white", this.spriteSize)
            this.drawSprite("#", { x: 94, y: 94 }, "blue", "white", this.spriteSize)

            this.drawSprite("#", { x: 115, y: 10 }, "green", "white", this.spriteSize)
            this.drawSprite("rFancy", { x: 115, y: 31 }, "green", "white", this.spriteSize)
            this.drawSprite(".", { x: 115, y: 52 }, "green", "white", this.spriteSize)
            this.drawSprite(".", { x: 115, y: 73 }, "green", "white", this.spriteSize)
            this.drawSprite("#", { x: 115, y: 94 }, "green", "white", this.spriteSize)

            this.drawSprite("#", { x: 136, y: 10 }, "red", "white", this.spriteSize)
            this.drawSprite(".", { x: 136, y: 31 }, "red", "white", this.spriteSize)
            this.drawSprite(".", { x: 136, y: 52 }, "red", "white", this.spriteSize)
            this.drawSprite("shield", { x: 136, y: 73 }, "red", "white", this.spriteSize)
            this.drawSprite("#", { x: 136, y: 94 }, "red", "white", this.spriteSize)

            this.drawSprite("#", { x: 157, y: 10 }, "purple", "white", this.spriteSize)
            this.drawSprite(".", { x: 157, y: 31 }, "purple", "white", this.spriteSize)
            this.drawSprite(".", { x: 157, y: 52 }, "purple", "white", this.spriteSize)
            this.drawSprite("@", { x: 157, y: 73 }, "purple", "white", this.spriteSize)
            this.drawSprite("#", { x: 157, y: 94 }, "purple", "white", this.spriteSize)

            this.drawSprite("#", { x: 178, y: 10 }, "teal", "white", this.spriteSize)
            this.drawSprite(".", { x: 178, y: 31 }, "teal", "white", this.spriteSize)
            this.drawSprite(".", { x: 178, y: 52 }, "teal", "white", this.spriteSize)
            this.drawSprite("sword", { x: 178, y: 73 }, "teal", "white", this.spriteSize)
            this.drawSprite("#", { x: 178, y: 94 }, "teal", "white", this.spriteSize)

            this.drawSprite("#", { x: 199, y: 10 }, "indigo", "white", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 31 }, "indigo", "white", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 52 }, "indigo", "white", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 73 }, "indigo", "white", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 94 }, "indigo", "white", this.spriteSize)
        }
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
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
                this.handleInput(event, e);
            });
        };
        bindEventToScreen("mousemove");
        bindEventToScreen("keydown");
        /**
         * Mouse Tracking
         */
        //window.addEventListener("pointermove", (e) => {
        //    console.log("setting mouse")
        //})
        /**
         * Resize and redraw
         */
        window.addEventListener("resize", () => {
            cancelAnimationFrame(this.dieselAnimation)
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
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
