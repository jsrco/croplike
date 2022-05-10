import { Actor } from "$lib/scripts/actor";
import { Tile } from "$lib/scripts/tile";

export class Diesel {
    #ctx: CanvasRenderingContext2D;
    #cellSize: number;
    #clientHeight: number;
    #clientWidth: number;
    #dieselAnimation: any;
    #interval: number;
    #lastTime: number;
    #locked: boolean;
    #player: Tile;
    #timer: number;
    #updating: Array<string>;

    constructor(ctx: CanvasRenderingContext2D, dieselAnimation: any, updateArray: Array<string>) {
        this.#cellSize = 25;
        this.#ctx = ctx;
        this.#ctx.font = "24px 'PressStart2P'";
        this.#ctx.fillStyle = "white";
        this.#ctx.fillText("croplike", 0, 30);
        this.#dieselAnimation = dieselAnimation;
        this.#interval = 1000 / 60;
        this.#lastTime = 0;
        // start with a locked game
        this.#locked = true;
        this.#timer = 0;
        this.#updating = updateArray;
    }
    // engine mechanics
    #EngineLock(tracking: string): void {
        if (this.#locked)
            console.log([
                tracking,
                "failed",
                "Game already locked. You should not be trying the action.",
            ]);
        else this.#locked = true;
    }
    #EngineUnlock(tracking: string): void {
        if (!this.#locked)
            console.log([
                tracking,
                "failed",
                "Game already unlocked. You should not be trying the action.",
            ]);
        else {
            this.#locked = false;
            this.#EngineUpdate(tracking);
        }
    }
    #EngineUpdate(tracking: string): void {
        if (this.#locked)
            console.log([
                tracking,
                "failed",
                "Game is locked. You should not be trying to update the engine.",
            ]);
        else {
            // handle reactions and moves
            this.#EngineLock(tracking);
            console.log([tracking, "succeeded", "Game has been updated."]);
        }
    }
    animate(timeStamp: number): void {
        if (this.#locked && this.#updating.length > 0) {
            const deltaTime = timeStamp - this.#lastTime;
            this.#lastTime = timeStamp;
            if (this.#timer > this.#interval) {
                this.#ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                //player
                this.#player = new Tile(this.#ctx, {
                    fillStyle: "orange",
                    size: this.#cellSize,
                    strokeStyle: "yellow",
                    x:  window.innerWidth / 2 - this.#cellSize / 2,
                    y:  window.innerHeight / 2 - this.#cellSize / 2,
                })
                this.#player.draw();
                this.#timer = 0;
            } else {
                this.#timer += deltaTime;
            }
        }
        this.#dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
    init(): void {
        this.animate(0);
    }
    /*
    renderGetOffsets(): void {
        const { pos } = this.player;
        let topLeftX = Math.max(0, pos[0].x - width / 2);
        topLeftX = Math.min(topLeftX, this.map.mapWidth - width);
        let topLeftY = Math.max(0, pos[0].y - height / 2);
        topLeftY = Math.min(topLeftY, this.map.mapHeight - height);
        return {
            x: topLeftX,
            y: topLeftY,
        };
    }
    test(action: string): void {
        this.#EngineUnlock(action);
    }
    */
}