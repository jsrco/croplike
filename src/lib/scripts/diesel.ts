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
        this.map = this.makeMap(500,500)
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
    drawMap():string {
        // after getting total tiles vs this.canvas w / h (make it always odd / odd) so player at center unless out of context. have it set on init / and resize, only needed if screensize changes.
        // so you get the player position, get the total tiles, if it is greater or === to the edge of the map / place player in center else place player off center of total Tiles
        // get upper left position for context of what to draw vs total tiles / player postion (center / off center), 
        // math map for loop
        // draw tiles only if they need 2 update
        // draw map center screen
        // draw player
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
            
            this.drawSprite("@", this.playerPoisiton, "purple", "white",this.spriteSize)
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
