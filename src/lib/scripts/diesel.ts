import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import type { position } from './interfaces'
export class Diesel {
    canvas: any
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
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.interval = 1000 / 60
        this.lastTime = 0
        this.locked = true
        this.spriteGrid = { x: 579 / 32, y: 291 / 16 }
        this.spriteSheet = new Image()
        this.spriteSheet.src = 'assets/ff5x5.png'
        this.spriteSheet.style.imageRendering = "pixelated";
        this.timer = 0
        this.playerPoisiton = { x: 10, y: 85 }
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
    drawSprite(type: string, pos: position, color: string,): void {
        const char: position = convertChar(type)
        // draw image, sx, sy, sw, sh, dx, dy, dw, dh
        this.ctx.drawImage(this.spriteSheet, this.spriteGrid.x * char.x, this.spriteGrid.y * char.y, this.spriteGrid.x, this.spriteGrid.y, pos.x, pos.y, this.spriteGrid.x, this.spriteGrid.y)
        // set composite mode
        this.ctx.globalCompositeOperation = 'source-in'
        // draw color
        this.ctx.fillStyle = color
        this.ctx.fillRect(pos.x, pos.y, this.spriteGrid.x, this.spriteGrid.y)
        // reset composite mode
        this.ctx.globalCompositeOperation = "source-over"
    }
    drawGrid(): void {
        for (let y = 2; y + this.spriteGrid.x < this.canvas.height; y += this.spriteGrid.x + 3) {
            for (let x = 2; x + this.spriteGrid.x < this.canvas.width; x += this.spriteGrid.x + 3) {
                this.drawGridPiece(x, y)
            }
        }
    }
    drawGridPiece(x: number, y: number): void {
        this.ctx.strokeStyle = ColorSwatch.red[9]
        this.ctx.lineWidth = 1;
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.strokeRect(x, y, this.spriteGrid.x, this.spriteGrid.x);
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
                this.drawSprite("#", { x: 10, y: 10 },"orange")
                this.drawSprite("sThick", { x: 10, y: 45 },"orange")
                this.drawSprite("oLower", { x: 10, y: 80 },"orange")
                this.drawSprite("rFull", { x: 10, y: 115 },"orange")
                this.drawSprite("#", { x: 10, y: 150 },"orange")
                this.drawSprite("#", { x: 10, y: 185 },"orange")
                this.drawSprite("#", { x: 10, y: 220 },"orange")
                this.drawSprite("#", { x: 10, y: 255 },"orange")
                this.drawSprite("#", { x: 10, y: 290 },"orange")


                this.drawSprite("#", { x: 45, y: 10 },"orange")
                this.drawSprite("uFull", { x: 45, y: 45 },"orange")
                this.drawSprite("fFancy", { x: 45, y: 80 },"orange")
                this.drawSprite("aThick", { x: 45, y: 115 },"orange")
                this.drawSprite("#", { x: 45, y: 150 },"orange")
                this.drawSprite("#", { x: 80, y: 10 },"orange")
                this.drawSprite("mLower", { x: 80, y: 45 },"orange")
                this.drawSprite(".", { x: 80, y: 80 },"orange")
                this.drawSprite("gFull", { x: 80, y: 115 },"orange")
                this.drawSprite("#", { x: 80, y: 150 },"orange")

                this.drawSprite("#", { x: 115, y: 10 },"orange")
                this.drawSprite("mUpper", { x: 115, y: 45 },"orange")
                this.drawSprite(".", { x: 115, y: 80 },"orange")
                this.drawSprite("eLower", { x: 115, y: 115 },"orange")
                this.drawSprite("#", { x: 115, y: 150 },"orange")

                this.drawSprite("#", { x: 150, y: 10 },"orange")
                this.drawSprite("eFull", { x: 150, y: 45 },"orange")
                this.drawSprite(".", { x: 150, y: 80 },"orange")
                this.drawSprite(".", { x: 150, y: 115 },"orange")
                this.drawSprite("#", { x: 150, y: 150 },"orange")

                this.drawSprite("#", { x: 185, y: 10 },"orange")
                this.drawSprite("rFancy", { x: 185, y: 45 },"orange")
                this.drawSprite(".", { x: 185, y: 80 },"orange")
                this.drawSprite(".", { x: 185, y: 115 },"orange")
                this.drawSprite("#", { x: 185, y: 150 },"orange")

                this.drawSprite("#", { x: 220, y: 10 },"orange")
                this.drawSprite(".", { x: 220, y: 45 },"orange")
                this.drawSprite(".", { x: 220, y: 80 },"orange")
                this.drawSprite("shield", { x: 220, y: 115 },"orange")
                this.drawSprite("#", { x: 220, y: 150 },"orange")

                this.drawSprite("#", { x: 255, y: 10 },"orange")
                this.drawSprite(".", { x: 255, y: 45 },"orange")
                this.drawSprite(".", { x: 255, y: 80 },"orange")
                this.drawSprite("@", { x: 255, y: 115 },"orange")
                this.drawSprite("#", { x: 255, y: 150 },"orange")

                this.drawSprite("#", { x: 290, y: 10 },"orange")
                this.drawSprite(".", { x: 290, y: 45 },"orange")
                this.drawSprite(".", { x: 290, y: 80 },"orange")
                this.drawSprite("sword", { x: 290, y: 115 },"orange")
                this.drawSprite("#", { x: 290, y: 150 },"orange")

                this.drawSprite("#", { x: 325, y: 10 },"orange")
                this.drawSprite("#", { x: 325, y: 45 },"orange")
                this.drawSprite("#", { x: 325, y: 80 },"orange")
                this.drawSprite("#", { x: 325, y: 115 },"orange")
                this.drawSprite("#", { x: 325, y: 150 },"orange")
                this.drawSprite("@", this.playerPoisiton, "orange")


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
