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
    playerPoisiton: position
    spriteGrid: position
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
        this.spriteGrid = { x: 579 / 32, y: 291 / 16 }
        this.spriteSheet = new Image()
        this.spriteSheet.src = 'assets/ff5x5.png'
        this.timer = 0
        this.playerPoisiton = { x: 10, y: 10 }
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
                this.playerPoisiton.x -= 15
            })
            // East
            else if (inputData.key === "ArrowRight") this.test("right", () => {
                this.playerPoisiton.x += 15
            })
            // North
            else if (inputData.key === "ArrowUp") this.test("up", () => {
                this.playerPoisiton.y -= 15
            })
            // South
            else if (inputData.key === "ArrowDown") this.test("down", () => {
                this.playerPoisiton.y += 15
            })
            // North West
            else if (inputData.keyCode === 36) this.test("up left", () => {
                this.playerPoisiton.x -= 15
                this.playerPoisiton.y -= 15
            })
            // North East
            else if (inputData.keyCode === 33) this.test("up right", () => {
                this.playerPoisiton.x += 15
                this.playerPoisiton.y -= 15
            })
            // South East
            else if (inputData.keyCode === 34) this.test("down right ", () => {
                this.playerPoisiton.x += 15
                this.playerPoisiton.y += 15
            })
            // South West
            else if (inputData.keyCode === 35) this.test("down left", () => {
                this.playerPoisiton.x -= 15
                this.playerPoisiton.y += 15
            })
        }
    }
    /**
     * Animate Game
     */
    drawFrame(type: string, pos: position, size) {
        // image , sx, sy, sw, sh, dx, dy, dw, dh
        const char: position = convertChar(type)
        this.ctx.drawImage(this.spriteSheet, this.spriteGrid.x * char.x, this.spriteGrid.y * char.y, this.spriteGrid.x, this.spriteGrid.y, pos.x, pos.y, size, size)
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
                this.drawFrame("aUpper", { x: 10, y: 10 }, 15)
                this.drawFrame("aLower", { x: 10, y: 25 }, 15)
                this.drawFrame("aFancy", { x: 10, y: 40 }, 15)
                this.drawFrame("aFull", { x: 10, y: 55 }, 15)
                this.drawFrame("aThick", { x: 10, y: 70 }, 15)
                this.drawFrame("@", { x: 10, y: 85 }, 15)
                this.drawFrame("skull", { x: 10, y: 100 }, 15)
                this.drawFrame("bUpper", { x: 25, y: 10 }, 15)
                this.drawFrame("bLower", { x: 25, y: 25 }, 15)
                this.drawFrame("bFancy", { x: 25, y: 40 }, 15)
                this.drawFrame("bFull", { x: 25, y: 55 }, 15)
                this.drawFrame("bThick", { x: 25, y: 70 }, 15)
                this.drawFrame("cUpper", { x: 40, y: 10 }, 15)
                this.drawFrame("cLower", { x: 40, y: 25 }, 15)
                this.drawFrame("cFancy", { x: 40, y: 40 }, 15)
                this.drawFrame("cFull", { x: 40, y: 55 }, 15)
                this.drawFrame("cThick", { x: 40, y: 70 }, 15)
                this.drawFrame("dUpper", { x: 55, y: 10 }, 15)
                this.drawFrame("dLower", { x: 55, y: 25 }, 15)
                this.drawFrame("dFancy", { x: 55, y: 40 }, 15)
                this.drawFrame("dFull", { x: 55, y: 55 }, 15)
                this.drawFrame("dThick", { x: 55, y: 70 }, 15)

                this.drawFrame("eUpper", { x: 70, y: 10 }, 15)
                this.drawFrame("eLower", { x: 70, y: 25 }, 15)
                this.drawFrame("eFancy", { x: 70, y: 40 }, 15)
                this.drawFrame("eFull", { x: 70, y: 55 }, 15)
                this.drawFrame("eThick", { x: 70, y: 70 }, 15)

                this.drawFrame("#", { x: 85, y: 10 }, 15)
                this.drawFrame("#", { x: 85, y: 25 }, 15)
                this.drawFrame("#", { x: 85, y: 40 }, 15)
                this.drawFrame("#", { x: 85, y: 55 }, 15)
                this.drawFrame("#", { x: 85, y: 70 }, 15)
                this.drawFrame("#", { x: 100, y: 10 }, 15)
                this.drawFrame(".", { x: 100, y: 25 }, 15)
                this.drawFrame(".", { x: 100, y: 40 }, 15)
                this.drawFrame(".", { x: 100, y: 55 }, 15)
                this.drawFrame("#", { x: 100, y: 70 }, 15)

                this.drawFrame("#", { x: 115, y: 10 }, 15)
                this.drawFrame(".", { x: 115, y: 25 }, 15)
                this.drawFrame(".", { x: 115, y: 40 }, 15)
                this.drawFrame(".", { x: 115, y: 55 }, 15)
                this.drawFrame("#", { x: 115, y: 70 }, 15)
                this.drawFrame("#", { x: 130, y: 10 }, 15)
                this.drawFrame(".", { x: 130, y: 25 }, 15)
                this.drawFrame(".", { x: 130, y: 40 }, 15)
                this.drawFrame(".", { x: 130, y: 55 }, 15)
                this.drawFrame("#", { x: 130, y: 70 }, 15)
                this.drawFrame("#", { x: 145, y: 10 }, 15)
                this.drawFrame("#", { x: 145, y: 25 }, 15)
                this.drawFrame("#", { x: 145, y: 40 }, 15)
                this.drawFrame("#", { x: 145, y: 55 }, 15)
                this.drawFrame("#", { x: 145, y: 70 }, 15)
                this.drawFrame("@", this.playerPoisiton, 15)


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
