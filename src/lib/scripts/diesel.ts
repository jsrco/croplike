import { Actor } from "$lib/scripts/actor";

export class Diesel {
    #ctx: CanvasRenderingContext2D;
    #cellSize: number;
    #dieselAnimation: any;
    #interval: number;
    #lastTime: number;
    #locked: boolean;
    #player: Actor;
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
        this.#player = new Actor(ctx, 2, 2, 25, updateArray);
    }
    // engine mechanics
    #EngineLock(tracking: string):void {
        if (this.#locked)
            console.log([
                tracking,
                "failed",
                "Game already locked. You should not be trying the action.",
            ]);
        else this.#locked = true;
    }
    #EngineUnlock(tracking: string):void {
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
    #EngineUpdate(tracking: string):void {
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
    animate(timeStamp: number):void {
        if (this.#locked && this.#updating.length > 0) {
            const deltaTime = timeStamp - this.#lastTime;
            this.#lastTime = timeStamp;
            if (this.#timer > this.#interval) {
                this.#ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.drawGrid();
                //player
                this.#player.draw();
                this.#player.update();
                this.#timer = 0;
            } else {
                this.#timer += deltaTime;
            }
        }
        this.#dieselAnimation = requestAnimationFrame(this.animate.bind(this));
    }
    drawGrid():void {
        for (
            let y = 2;
            y + this.#cellSize < window.innerHeight;
            y += this.#cellSize
        ) {
            for (
                let x = 2;
                x + this.#cellSize < window.innerWidth;
                x += this.#cellSize
            ) {
                this.drawGridPiece(x, y);
            }
        }
    }
    drawGridPiece(x: number, y: number):void {
        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 1;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.rect(x, y, 25, 25);
        this.#ctx.stroke();
    }
    init():void {
        this.animate(0);
        this.test("animation test");
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
    */
    test(action: string):void {
        this.#EngineUnlock(action);
        this.#player.move(78, 2);
    }
}