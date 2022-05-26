import type { Mouse } from '$lib/scripts/interfaces/index'
export class Diesel {
    #canvas: any;
    #dieselAnimation: any;
    #mouse: Mouse
    #interval: number;
    #lastTime: number;
    #locked: boolean;
    #timer: number;
    #updating: boolean;
    constructor(canvas: any) {
        this.#canvas = canvas;
        // displayOptions imported from Rot to create a new display.
        // display logic map out in regards to animation loop and render 
        // handle stage === camera
        // handle offset
        // handle actor updates
        // clamp camera to hero but allow border move
        this.#canvas.ctx = canvas.getContext("2d");
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
        this.#canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.#dieselAnimation = requestAnimationFrame(this.tick.bind(this));
        this.#interval = 1000 / 60;
        this.#lastTime = 0;
        this.#locked = true;
        this.#mouse = {
            radius: 25,
            x: 0,
            y: 0,
        };
        this.#timer = 0;
        this.#updating = false;
    }
    /**
     * Engine Mechanics
     */
    #EngineLock(tracking: string): void {
        if (!this.#locked)
            this.#locked = true;
        else
            console.log(`::failed::\n    ${tracking}\n    Game already locked. You should not be trying the action.`)
    }
    #EngineUnlock(tracking: string, action: () => void): void {
        if (this.#locked) {
            this.#locked = false;
            this.#EngineUpdate(tracking, action);
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game already unlocked. You should not be trying the action.`)
    }
    #EngineUpdate(tracking: string, action: () => void): void {
        if (!this.#locked) {
            // actions handle any game updates and will lock the game accordingly. 
            action()
            console.log(`::succeeded::\n    ${tracking}\n    Game has been updated.`);
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game is locked. You should not be trying to update the engine.`)
    }
    /**
     * Animate Game
     */
    tick(timeStamp: number): void {
        const deltaTime = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;
        if (this.#timer > this.#interval) {
            if (this.#locked && this.#updating) {
                this.#canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                //player here so the postion is always updated when draw occurs

                /**
                 * Demo draw
                 */
                this.#canvas.ctx.font = "24px 'PressStart2P'";
                this.#canvas.ctx.fillStyle = "white";
                this.#canvas.ctx.fillText("croplike", 12, 30);
                /**
                 * Reset Timer
                 */
                this.#timer = 0;
            }
        } else {
            this.#timer += deltaTime;
        }
        this.#dieselAnimation = requestAnimationFrame(this.tick.bind(this));
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
                if (this.#canvas.requestFullscreen) {
                    this.#canvas.requestFullscreen();
                } else if (this.#canvas.webkitRequestFullscreen) {
                    this.#canvas.webkitRequestFullscreen();
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
         * Mouse Tracking
         */
        window.addEventListener("pointermove", (e) => {
            this.#mouse.x = e.x;
            this.#mouse.y = e.y;
        });
        /**
         * Resize and redraw
         */
        window.addEventListener("resize", () => {
            cancelAnimationFrame(this.#dieselAnimation);
            this.#canvas.width = window.innerWidth;
            this.#canvas.height = window.innerHeight;
            this.tick(0);
        });
        /**
         * Init Game
         */
        this.tick(0);
        this.test("action test", () => {
            this.#updating = true;
            console.log("this is a test action, and game lock")
            this.#EngineLock("action test lock tracking message")
        })
    }
    /**
     * Test Function
     */
    test(tracking: string, action: () => void): void {
        this.#EngineUnlock(tracking, action);
    }
}