/**
 * Future work:
 * - Ryan's Private AI and idea
 * - Display Class = * - Map Render, Utility for Map / Enity / Object Renders/ (No to this right now.)
 * - https://tympanus.net/Tutorials/CustomCursors/index5.html
 * -- only Actions unlock the engine and Reactions lock the engine
 * -- actions cause entity reactions
 * -- Map can only change map, Entity can only change Entity Data. 
 * 
 * .........
 * ...v.....
 * ....v....
 * ...xvx...  This is an example of large creature.
 * .vvxxvv..  The vv represent legs.
 * ..xxxx...  The single v represents a tail segment.
 * .vvxxvv..
 * ..xxxx...
 * ...xx....
 * .........
 
*/

import { Display, FOV } from "rot-js";
import { writable } from "svelte/store";

import Actions from "$lib/scripts/game/Actions";
import ColorSwatch from "$lib/scripts/game/ColorSwatch";
import Entity from "$lib/scripts/game/Entity";
import Maps from "$lib/scripts/game/Maps";
import Metrics from "$lib/stores/metricStore";

const dieselEngine = writable({
    actions: Actions,
    display: null,
    displayOptions: {
        bg: ColorSwatch.bgDark,
        fg: ColorSwatch.red[4],
        fontSize: 10,
        fontFamily: "'PressStart2P', cursive",
        forceSquareRatio: true,
        height: 24,
        spacing: 1.1,
        width: 24,
    },
    entites: [],
    gameTime: 1,
    gameTimeFlow: true,
    // Start with a locked game
    locked: true,
    map: new Maps({ mapHeight: 34, mapWidth: 34 }),
    player: null,
    // Engine Mechanics
    EngineLock() {
        if (this.locked) Metrics.addDebug("Game already locked.");
        else this.locked = true;
    },
    EngineUnlock(tracking) {
        if (!this.locked)
            Metrics.addDebug(
                "Game already unlocked. You should not be trying the action: " +
                tracking
            );
        else this.locked = false;
        this.EngineUpdate();
    },
    EngineUpdate() {
        // Handle Reactions to player moves
        this.tick()

        // Temp Entity Action
        this.entites[0].ai.act()

        this.renderDisplay();
        this.EngineLock();
    },
    handleInputClickMove(dx, dy, d, inputType) {
        d === "player" ? this.actions.move(this.player, dx, dy, this.player.facing, inputType) : this.actions.move(this.player, dx, dy, d, inputType)
    },
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            Metrics.addEventData(this.map.tiles[this.player.pos[0].x][this.player.pos[0].y])
            Metrics.totalKeyboardEvents; // Total Keyboard Event Tracking
            // West
            if (inputData.key === "ArrowLeft") this.actions.move(this.player, -1, 0, 6, 0);
            // East
            else if (inputData.key === "ArrowRight") this.actions.move(this.player, 1, 0, 2, 0);
            // North
            else if (inputData.key === "ArrowUp") this.actions.move(this.player, 0, -1, 0, 0);
            // South
            else if (inputData.key === "ArrowDown") this.actions.move(this.player, 0, 1, 4, 0);
            // North West
            else if (inputData.keyCode === 36) this.actions.move(this.player, -1, -1, 7, 0);
            // North East
            else if (inputData.keyCode === 33) this.actions.move(this.player, 1, -1, 1, 0);
            // South East
            else if (inputData.keyCode === 34) this.actions.move(this.player, 1, 1, 3, 0);
            // South West
            else if (inputData.keyCode === 35) this.actions.move(this.player, -1, 1, 5, 0);
            // Wait
            else if (inputData.keyCode === 12)
                this.actions.move(this.player, 0, 0, this.player.facing, 0);
        } else if (inputType === "mousemove") {
            let mouseInputsCoords = this.display.eventToPosition(inputData)
            if (mouseInputsCoords[0] >= 0 && mouseInputsCoords[1] >= 0) {
                const offsets = this.renderGetOffsets();
                if (this.player.pos[0].x === offsets.x + mouseInputsCoords[0] && this.player.pos[0].y === offsets.y + mouseInputsCoords[1]) {
                    Metrics.addEventData({ explored: "yas", name: "it's u", walkable: "yas" })
                } else if (!this.map.tiles[offsets.x + mouseInputsCoords[0]][offsets.y + mouseInputsCoords[1]].explored) {
                    Metrics.addEventData({ explored: "false", name: "?", walkable: "?" })
                }else if (this.entites[0].pos[0].x === offsets.x + mouseInputsCoords[0] && this.entites[0].pos[0].y === offsets.y + mouseInputsCoords[1]) {
                    Metrics.addEventData({ explored: "yas", name: "Todd", walkable: "no" })
                } else {
                    Metrics.addEventData(this.map.tiles[offsets.x + mouseInputsCoords[0]][offsets.y + mouseInputsCoords[1]])
                }
            } else {
                Metrics.addEventData({ explored: "move or mouseover", name: "move or mouseover", walkable: "move or mouseover" })
            }
        }
    },
    // Time 
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
        Metrics.addTOD(this.gameTime)
    },
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
                let tile = this.map.tiles[x][y];
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

                    let ch = r ? this.map.tiles[x][y].char : "@";
                    let color = this.map.tiles[x][y] ? fgColor : fg;
                    displayB.draw(fovX, fovY, ch, color);
                    this.map.tiles[x][y].explored = true


                    // Render Entities Temp
                    let entityTodd = this.entites[0]
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
    },
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
    },
    // Start Game
    init(gameContainer) {
        this.display = new Display(this.displayOptions);
        gameContainer.appendChild(this.display.getContainer());
        // Bind keyboard input events for game to display
        let bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                this.handleInput(event, e);
            });
        };
        bindEventToScreen("mousemove");
        bindEventToScreen("keydown");
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
        this.map.tiles[17][10].walkable = false;
        this.entites.push(new Entity({
            char: "T",
            fg: ColorSwatch.yellow[4],
            map: this.map,
            name: "Todd",
            pos: [{ x: 17, y: 10 },],
        }))
        this.renderDisplay()
    }
});

const Game = {
    subscribe: dieselEngine.subscribe,
    clickMove: (dx, dy, d, inputType) => {
        dieselEngine.update(self => {
            self.handleInputClickMove(dx, dy, d, inputType)
            return self
        })
    },
    engineRender: () => {
        dieselEngine.update(self => {
            self.renderDisplay()
            return self
        })
    },
    engineUnlock: (str) => {
        dieselEngine.update(self => {
            self.EngineUnlock(str)
            return self
        })
    },
};

export default Game;
