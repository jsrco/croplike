import { Display, FOV } from "rot-js"
import ColorSwatch from "./ColorSwatch"
import Entity from "./Entity"
import Maps from "./Maps"

export class Diesel {
    display: any
    displayOptions: any
    entities: any
    gameTime: number
    gameTimeFlow: boolean
    locked: boolean
    map: Maps
    mouse: any
    player: Entity
    constructor(gameContainer) {
        this.display = new Display(this.displayOptions);
        gameContainer.appendChild(this.display.getContainer());
        this.displayOptions = {
            bg: ColorSwatch.bgDark,
            fg: ColorSwatch.red[4],
            fontSize: 10,
            fontFamily: "'PressStart2P', cursive",
            forceSquareRatio: true,
            height: 450,
            spacing: 1.1,
            width: 800,
        }
        this.entities = []
        this.gameTime = 1
        this.gameTimeFlow = true
        // Start with a locked game
        this.locked = true
        this.map = new Maps({ mapHeight: 1000, mapWidth: 1000 })
        this.mouse = {
            radius: 25,
            x: 0,
            y: 0,
        }
        this.player = new Entity({
            char: "@",
            fg: "#fff",
            map: this.map,
            name: "player",
            pos: [{ x: 13, y: 14 },]
            // Add to the array for 3 x 3 player.
            // { x: 12, y: 14 }, { x: 14, y: 14 },
            //{ x: 13, y: 13 }, { x: 12, y: 13 }, { x: 14, y: 13 },
            //{ x: 13, y: 15 }, { x: 12, y: 15 }, { x: 14, y: 15 },]
        });
    }
    /**
     * Engine Mechanics
     */
    EngineLock(tracking: string): void {
        if (this.locked) console.log(`::failed::\n    ${tracking}\n    Game already locked. You should not be trying the action.`);
        else this.locked = true;
    }
    EngineUnlock(tracking: string, action): void {
        if (!this.locked) console.log(`::failed::\n    ${tracking}\n    Game already unlocked. You should not be trying the action.`)
        else this.locked = false;
        this.EngineUpdate(tracking, action);
    }
    EngineUpdate(tracking: string, action): void {
        if (!this.locked) {
            // Handle Reactions to player moves
            this.tick()

            // actions handle any game updates and will lock the game accordingly. 
            //action()
            console.log(`::succeeded::\n    ${tracking}\n    Game has been updated.`)

            // Temp Entity Action
            this.entities[0].ai.act()

            this.renderDisplay();
            this.EngineLock("tracking");
        }
        else
            console.log(`::failed::\n    ${tracking}\n    Game is locked. You should not be trying to update the engine.`)
    }
    /**
     * Time
     */
    tick() {
        if (this.gameTimeFlow) {
            if (this.gameTime >= 9) {
                this.gameTimeFlow = false

            } else this.gameTime++
        } else {
            if (this.gameTime <= 1) {
                this.gameTimeFlow = true
            } else this.gameTime--
        }
    }
    move(entity, dx, dy, d, inputType) {
        // Looking will not add to engine for now
        if (entity.facing !== d) {
            entity.facing = d;
            this.renderDisplay()
        } else {
            // Check Reaction
            if (entity.tryMove(dx, dy)) {
                // Console Logging
                this.EngineUnlock("move", console.log("moving"))
            } else console.log(`::failed::\n    ${"moving"}\n    Move failed.`)

        }
    }
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            // West
            if (inputData.key === "ArrowLeft") this.move(this.player, -1, 0, 6, 0);
            // East
            else if (inputData.key === "ArrowRight") this.move(this.player, 1, 0, 2, 0);
            // North
            else if (inputData.key === "ArrowUp") this.move(this.player, 0, -1, 0, 0);
            // South
            else if (inputData.key === "ArrowDown") this.move(this.player, 0, 1, 4, 0);
            // North West
            else if (inputData.keyCode === 36) this.move(this.player, -1, -1, 7, 0);
            // North East
            else if (inputData.keyCode === 33) this.move(this.player, 1, -1, 1, 0);
            // South East
            else if (inputData.keyCode === 34) this.move(this.player, 1, 1, 3, 0);
            // South West
            else if (inputData.keyCode === 35) this.move(this.player, -1, 1, 5, 0);
            // Wait
            else if (inputData.keyCode === 12)
                this.move(this.player, 0, 0, this.player.facing, 0);
        }
    }
    // Renders
    renderDisplay() {
        const { height, width } = this.displayOptions;
        const { char, facing, fg, pos } = this.player;
        const displayB = this.display;
        const lightpasses = (x, y) => {
            return this.map.tiles[x] !== undefined && this.map.tiles[x][y] !== undefined
                ? this.map.tiles[x][y].lightPasses
                : false;
        };
        const fov = new FOV.RecursiveShadowcasting(lightpasses);
        const offsets = this.renderGetOffsets();

        for (let x = offsets.x; x < offsets.x + width; x++) {
            for (let y = offsets.y; y < offsets.y + height; y++) {
                const tile = this.map.tiles[x][y];
                let fgColor = tile.fg
                if (this.gameTime > 2) fgColor = ColorSwatch.purple[9]
                if (this.gameTime > 7) fgColor = ColorSwatch.blueGray[9]
                this.display.draw(
                    x - offsets.x,
                    y - offsets.y,
                    tile.char,
                    tile.explored ? fgColor : ColorSwatch.bgDark,
                    tile.explored ? tile.bg : ColorSwatch.bgDark
                );
            }
        }

        let fovTime = 8
        if (this.gameTime > 2) fovTime = 6;
        if (this.gameTime > 7) fovTime = 4;

        fov.compute90(
            pos[0].x,
            pos[0].y,
            fovTime,
            facing,
            (
                x,
                y,
                r,
            ) => {
                const fovX = x - offsets.x;
                const fovY = y - offsets.y;

                if (
                    this.map.tiles[x] !== undefined &&
                    this.map.tiles[x][y] !== undefined
                ) {
                    let fgColor = ColorSwatch.red[5]
                    if (this.gameTime > 2) fgColor = ColorSwatch.purple[5];
                    if (this.gameTime > 7) fgColor = ColorSwatch.blue[5];

                    const ch = r ? this.map.tiles[x][y].char : "@";
                    const color = this.map.tiles[x][y] ? fgColor : fg;
                    displayB.draw(fovX, fovY, ch, color);
                    this.map.tiles[x][y].explored = true


                    // Render Entities Temp
                    const entityTodd = this.entities[0]
                    if (x === entityTodd.pos[0].x && y === entityTodd.pos[0].y) {
                        this.display.draw(
                            entityTodd.pos[0].x - offsets.x,
                            entityTodd.pos[0].y - offsets.y,
                            entityTodd.char,
                            this.map.tiles[entityTodd.pos[0].x][entityTodd.pos[0].y].explored ? entityTodd.fg : ColorSwatch.bgDark,
                            entityTodd.explored ? entityTodd.bg : ColorSwatch.bgDark);

                    }
                }
            }
        );

        // draw player last   
        for (let i = 0; i < this.player.pos.length; i++) {
            // draw structure if it exist
            this.display.draw(pos[i].x - offsets.x, pos[i].y - offsets.y, char, fg);
        }
    }
    renderGetOffsets() {
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
    }
    init(): void {
        /**
         *  Bind keyboard input events for game to display
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
            this.display.width = window.innerWidth
            this.display.height = window.innerHeight
            this.renderDisplay()
        })

        this.map.tiles[17][10].walkable = false;
        this.entities.push(new Entity({
            char: "T",
            fg: ColorSwatch.yellow[4],
            map: this.map,
            name: "Todd",
            pos: [{ x: 17, y: 10 },],
        }))
        this.renderDisplay()
    }
}