import { ColorSwatch } from './colorSwatch'
import { convertChar } from './convertChar'
import type { position } from './interfaces'
export class Diesel {
    canvas: any
    ctx: CanvasRenderingContext2D
    dieselAnimation: any
    locked: boolean
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
    drawSprite(type: string, pos: position, color: string, size: number): void {
        const char: position = convertChar(type)
        // draw image, sx, sy, sw, sh, dx, dy, dw, dh
        this.ctx.drawImage(this.spriteSheet, 
            18 * char.x, 18 * char.y, 21, 21, 
            pos.x, pos.y, size, size)
        // set composite mode
        this.ctx.globalCompositeOperation = 'source-atop'
        // draw color
        this.ctx.fillStyle = color
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
            this.drawSprite("#", { x: 10, y: 10 }, "orange", this.spriteSize)
            this.drawSprite("sThick", { x: 10, y: 31 }, "orange", this.spriteSize)
            this.drawSprite("oLower", { x: 10, y: 52 }, "orange", this.spriteSize)
            this.drawSprite("rFull", { x: 10, y: 73 }, "orange", this.spriteSize)
            this.drawSprite("#", { x: 10, y: 94 }, "orange", this.spriteSize)


            this.drawSprite("#", { x: 31, y: 10 }, "salmon", this.spriteSize)
            this.drawSprite("uFull", { x: 31, y: 31 }, "salmon", this.spriteSize)
            this.drawSprite("fFancy", { x: 31, y: 52 }, "salmon", this.spriteSize)
            this.drawSprite("aThick", { x: 31, y: 73 }, "salmon", this.spriteSize)
            this.drawSprite("#", { x: 31, y: 94 }, "salmon", this.spriteSize)

            this.drawSprite("#", { x: 52, y: 10 }, "pink", this.spriteSize)
            this.drawSprite("mLower", { x: 52, y: 31 }, "pink", this.spriteSize)
            this.drawSprite(".", { x: 52, y: 52 }, "pink", this.spriteSize)
            this.drawSprite("gFull", { x: 52, y: 73 }, "pink", this.spriteSize)
            this.drawSprite("#", { x: 52, y: 94 }, "pink", this.spriteSize)

            this.drawSprite("#", { x: 73, y: 10 }, "yellow", this.spriteSize)
            this.drawSprite("mUpper", { x: 73, y: 31 }, "yellow", this.spriteSize)
            this.drawSprite(".", { x: 73, y: 52 }, "yellow", this.spriteSize)
            this.drawSprite("eLower", { x: 73, y: 73 }, "yellow", this.spriteSize)
            this.drawSprite("#", { x: 73, y: 94 }, "yellow", this.spriteSize)

            this.drawSprite("#", { x: 94, y: 10 }, "blue", this.spriteSize)
            this.drawSprite("eFull", { x: 94, y: 31 }, "blue", this.spriteSize)
            this.drawSprite(".", { x: 94, y: 52 }, "blue", this.spriteSize)
            this.drawSprite(".", { x: 94, y: 73 }, "blue", this.spriteSize)
            this.drawSprite("#", { x: 94, y: 94 }, "blue", this.spriteSize)

            this.drawSprite("#", { x: 115, y: 10 }, "green", this.spriteSize)
            this.drawSprite("rFancy", { x: 115, y: 31 }, "green", this.spriteSize)
            this.drawSprite(".", { x: 115, y: 52 }, "green", this.spriteSize)
            this.drawSprite(".", { x: 115, y: 73 }, "green", this.spriteSize)
            this.drawSprite("#", { x: 115, y: 94 }, "green", this.spriteSize)

            this.drawSprite("#", { x: 136, y: 10 }, "red", this.spriteSize)
            this.drawSprite(".", { x: 136, y: 31 }, "red", this.spriteSize)
            this.drawSprite(".", { x: 136, y: 52 }, "red", this.spriteSize)
            this.drawSprite("shield", { x: 136, y: 73 }, "red", this.spriteSize)
            this.drawSprite("#", { x: 136, y: 94 }, "red", this.spriteSize)

            this.drawSprite("#", { x: 157, y: 10 }, "purple", this.spriteSize)
            this.drawSprite(".", { x: 157, y: 31 }, "purple", this.spriteSize)
            this.drawSprite(".", { x: 157, y: 52 }, "purple", this.spriteSize)
            this.drawSprite("@", { x: 157, y: 73 }, "purple", this.spriteSize)
            this.drawSprite("#", { x: 157, y: 94 }, "purple", this.spriteSize)

            this.drawSprite("#", { x: 178, y: 10 }, "teal", this.spriteSize)
            this.drawSprite(".", { x: 178, y: 31 }, "teal", this.spriteSize)
            this.drawSprite(".", { x: 178, y: 52 }, "teal", this.spriteSize)
            this.drawSprite("sword", { x: 178, y: 73 }, "teal", this.spriteSize)
            this.drawSprite("#", { x: 178, y: 94 }, "teal", this.spriteSize)

            this.drawSprite("#", { x: 199, y: 10 }, "indigo", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 31 }, "indigo", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 52 }, "indigo", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 73 }, "indigo", this.spriteSize)
            this.drawSprite("#", { x: 199, y: 94 }, "indigo", this.spriteSize)
            this.drawSprite("@", this.playerPoisiton, "white", this.spriteSize)
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
