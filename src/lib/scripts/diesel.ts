import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import type { position } from './interfaces'
export class Diesel {
    canvas: any
    cellSize: number
    ctx: CanvasRenderingContext2D
    dieselAnimation: any
    interval: number
    lastTime: number
    locked: boolean
    spriteSheet: HTMLImageElement
    timer: number
    constructor(canvas: any) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.cellSize = 30
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.interval = 1000 / 60
        this.lastTime = 0
        this.locked = true
        this.spriteSheet = new Image()
        this.spriteSheet.src = 'assets/ff5x5.png'
        this.timer = 0

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
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            // West
            if (inputData.key === "ArrowLeft") this.test("left", () => {
                console.log("attempted move")
            })
            // East
            else if (inputData.key === "ArrowRight") this.test("right", () => {
                console.log("attempted move")
            })
            // North
            else if (inputData.key === "ArrowUp") this.test("up", () => {
                console.log("attempted move")
            })
            // South
            else if (inputData.key === "ArrowDown") this.test("down", () => {
                console.log("attempted move")
            })
        }
    }
    /**
     * Animate Game
     */
    drawFrame(type: string, pos: position, size) {
        // image , sx, sy, sw, sh, dx, dy, dw, dh
        const spritegrid: position = { x: 579 / 32, y: 291 / 16 }
        const char: position = convertChar(type)
        this.ctx.drawImage(this.spriteSheet, spritegrid.x * char.x, spritegrid.y * char.y, spritegrid.x, spritegrid.y, pos.x, pos.y, size, size)
    }
    drawGrid(): void {
        for (let y = 2; y + this.cellSize < this.canvas.height; y += this.cellSize + 3) {
            for (let x = 2; x + this.cellSize < this.canvas.width; x += this.cellSize + 3) {
                this.drawGridPiece(x, y)
            }
        }
    }
    drawGridPiece(x: number, y: number): void {
        this.ctx.strokeStyle = ColorSwatch.red[9]
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
    }
    tick(timeStamp: number): void {
        const deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp
        if (this.timer > this.interval) {
            if (this.locked) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                /**
                 * Demo draw
                 */
                this.drawFrame("aUpper",{x:10,y:10}, 15)
                this.drawFrame("aLower",{x:10,y:35}, 15)
                this.drawFrame("aFancy",{x:10,y:60}, 15)
                this.drawFrame("aFull",{x:10,y:85}, 15)
                this.drawFrame("aThick",{x:10,y:110}, 15)
                this.drawFrame("@",{x:10,y:135}, 15)
                this.drawFrame("skull",{x:10,y:160}, 15)
                this.drawFrame("bUpper",{x:35,y:10}, 15)
                this.drawFrame("bLower",{x:35,y:35}, 15)
                this.drawFrame("bFancy",{x:35,y:60}, 15)
                this.drawFrame("bFull",{x:35,y:85}, 15)
                this.drawFrame("bThick",{x:35,y:110}, 15)
                this.drawFrame("cUpper",{x:60,y:10}, 15)
                this.drawFrame("cLower",{x:60,y:35}, 15)
                this.drawFrame("cFancy",{x:60,y:60}, 15)
                this.drawFrame("cFull",{x:60,y:85}, 15)
                this.drawFrame("cThick",{x:60,y:110}, 15)
                this.drawFrame("dUpper",{x:85,y:10}, 15)
                this.drawFrame("dLower",{x:85,y:35}, 15)
                this.drawFrame("dFancy",{x:85,y:60}, 15)
                this.drawFrame("dFull",{x:85,y:85}, 15)
                this.drawFrame("dThick",{x:85,y:110}, 15)
                
                this.drawFrame("eUpper",{x:110,y:10}, 15)
                this.drawFrame("eLower",{x:110,y:35}, 15)
                this.drawFrame("eFancy",{x:110,y:60}, 15)
                this.drawFrame("eFull",{x:110,y:85}, 15)
                this.drawFrame("eThick",{x:110,y:110}, 15)
                //this.drawGrid()
                //this.ctx.font = "24px 'PressStart2P'"
                //this.ctx.fillText("croplike", 12, 30)
                //this.ctx.fillStyle = "white"
                /**
                 * Reset Timer
                 */
                this.timer = 0
            }
        } else {
            this.timer += deltaTime
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
            this.tick(0)
        })
        /**
         * Init Game
         */
        this.tick(0)
    }
    /**
     * Test Function
     */
    test(tracking: string, action: () => void): void {
        this.#EngineUnlock(tracking, action)
    }
}
