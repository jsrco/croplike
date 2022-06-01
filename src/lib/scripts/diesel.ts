import type { Mouse } from '$lib/scripts/interfaces/index'
import { ColorSwatch } from './colorSwatch'
import { Tile } from './tile'
export class Diesel {
    canvas: any
    dieselAnimation: any
    mouse: Mouse
    interval: number
    lastTime: number
    locked: boolean
    player: Tile
    timer: number
    constructor(canvas: any) {
        this.canvas = canvas
        this.canvas.ctx = canvas.getContext("2d")
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.dieselAnimation = requestAnimationFrame(this.tick.bind(this))
        this.interval = 1000 / 60
        this.lastTime = 0
        this.locked = true
        this.mouse = {
            radius: 25,
            x: 0,
            y: 0,
        }
        this.player = new Tile({
            char: "@",
            explorable: false,
            explored: true,
            fillStyle: ColorSwatch.red[4],
            lightPasses: false,
            name: "player",
            position: { x: 0, y: 0 },
            size: 10,
            strokeStyle: ColorSwatch.red[4],
        })
        this.timer = 0
    }
    /**
     * Engine Mechanics
     */
    EngineLock(tracking: string): void {
        if (!this.locked)
            this.locked = true
        else
            console.log(`::failed::\n    ${tracking}\n    Game already locked. You should not be trying the action.`)
    }
    EngineUnlock(tracking: string, action: () => void): void {
        if (this.locked) {
            this.locked = false
            this.EngineUpdate(tracking, action)
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game already unlocked. You should not be trying the action.`)
    }
    EngineUpdate(tracking: string, action: () => void): void {
        if (!this.locked) {
            // actions handle any game updates and will lock the game accordingly. 
            action()
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
                this.player.updatePosition({ x: -10, y: 0 })
                this.EngineLock("player move left")
            })
            // East
            else if (inputData.key === "ArrowRight") this.test("right", () => {
                this.player.updatePosition({ x: 10, y: 0 })
                this.EngineLock("player move right")
            })
            // North
            else if (inputData.key === "ArrowUp") this.test("up", () => {
                this.player.updatePosition({ x: 0, y: -10 })
                this.EngineLock("player move up")
            })
            // South
            else if (inputData.key === "ArrowDown") this.test("down", () => {
                this.player.updatePosition({ x: 0, y: 10 })
                this.EngineLock("player move down")
            })
        }
    }
    /**
     * Animate Game
     */
    tick(timeStamp: number): void {
        const deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp
        if (this.timer > this.interval) {
            if (this.locked) {
         this.canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
                /**
                 * Demo draw
                 */
                this.canvas.ctx.font = "24px 'PressStart2P'"
                this.canvas.ctx.fillStyle = "white"
                this.canvas.ctx.fillText("croplike", 12, 30)
                /**
                 * Reset Timer
                 */
                this.timer = 0

                                //player here so the postion is always updated when draw occurs
                this.player.draw(this.canvas.ctx)
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
        window.addEventListener("pointermove", (e) => {
            this.mouse.x = e.x
            this.mouse.y = e.y
        })
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
        this.EngineUnlock(tracking, action)
    }
}