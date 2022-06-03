import { ColorSwatch } from './colorSwatch'
export class Diesel {
    canvas: any
    cellSize: number
    ctx:  CanvasRenderingContext2D
    dieselAnimation: any
    interval: number
    lastTime: number
    locked: boolean
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
    drawGrid():void {
        for (let y = 2; y + this.cellSize < this.canvas.height; y += this.cellSize + 3) {
            for (let x = 2; x + this.cellSize < this.canvas.width; x += this.cellSize + 3) {
                this.drawGridPiece(x, y)
            }
        }
    }
    drawGridPiece(x: number, y: number):void {
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
                this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
                /**
                 * Demo draw
                 */
                
                this.drawGrid()
                this.ctx.font = "24px 'PressStart2P'"
                this.ctx.fillText("croplike", 12, 30)
                this.ctx.fillStyle = "white"
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
