import { Builder } from './builder'
import { Game } from './diesel'
import { Templates } from './entities'
import { Entity } from './entity'
import { Cave } from './map.cave'
import { sendMessage } from './utility'
export const Screen: any = {}
Screen.gainStatScreen = {
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            if (inputData.keyCode >= 65 && inputData.keyCode <= 90) {
                const index = inputData.keyCode - 65
                if (this.options[index]) {
                    this.options[index][1].call(this.entity)
                    this.entity.statPoints--
                    if (this.entity.statPoints === 0) {
                        Screen.playScreen.setSubScreen(undefined)
                    } else {
                        Game.refresh()
                    }
                }
            }
        }
    },
    render(display) {
        const letters = 'abcdefghijklmnopqrstuvwxyz'
        display.drawText(0, 0, 'Choose a stat to increase- ')
        for (let i = 0; i < this.options.length; i++) {
            display.drawText(0, 2 + i,
                letters.substring(i, i + 1) + ' - ' + this.options[i][0])
        }
        display.drawText(0, 4 + this.options.length,
            "Remaining points- " + this.entity.statPoints);
    },
    setup(entity) {
        this.entity = entity
        this.options = entity.statOptions
    },
}
Screen.helpScreen = {
    handleInput(inputType, inputData) {
        Screen.playScreen.setSubScreen(null)
    },
    render(display) {
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value => screenWidth = value.screenSize.width)
        let text = 'croplike help'
        const border = '-------------'
        let y = 0;
        display.drawText(screenWidth / 2 - text.length / 2, y++, text)
        display.drawText(screenWidth / 2 - text.length / 2, y++, border)
        display.drawText(0, y++, 'demo dungeon')
        display.drawText(0, y++, 'Find the giant zombie and get rid of it!')
        y += 3
        display.drawText(0, y++, '<8 direction arrow / numpad movement>')
        display.drawText(0, y++, '<i> to show the inventory screen')
        display.drawText(0, y++, '<h> to show the help screen')
        display.drawText(0, y++, 'double click for full screen')
        y += 3;
        text = '--- press any key to start game ---'
        display.drawText(screenWidth / 2 - text.length / 2, y++, text)
        screenWidthUnsub()
    },
}
Screen.loseScreen = {
    enter() { console.log('Entered lose screen.') },
    exit() { console.log('Exited lose screen.') },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    },
    render(display) {
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, 'You lose!')
        }
    }
}
Screen.playScreen = {
    display: null,
    gameEnded: false,
    gameStarted: false,
    infoCursor: [0, 0],
    map: null,
    offset: {
        x: 0,
        y: 0
    },
    player: null,
    showInventory: false,
    subScreen: null,
    enter() {
        console.log('Entered play screen.')
        this.gameEnded = false
        this.gameStarted = true
        const mapWidth = 25
        const mapHeight = 25
        const mapDepth = 3
        const tiles = new Builder(mapWidth, mapHeight, mapDepth).tiles
        this.player = new Entity(Templates.PlayerTemplate)
        this.map = new Cave(tiles, this.player)
        this.map.engine.start()
    },
    exit() { console.log('Exited play screen.') },
    getScreenOffsets() {
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value => screenWidth = value.screenSize.width)
        let screenHeight
        const screenHeightUnsub = Game.subscribe(value => screenHeight = value.screenSize.height)
        let topLeftX = Math.max(0, this.player.x - Math.floor(screenWidth / 2))
        topLeftX = Math.min(topLeftX, this.player.map.width - screenWidth)
        let topLeftY = Math.max(0, this.player.y - Math.floor(screenHeight / 2))
        topLeftY = Math.min(topLeftY, this.player.map.height - screenHeight)
        screenWidthUnsub()
        screenHeightUnsub()
        return {
            x: topLeftX,
            y: topLeftY
        }
    },
    handleInput(inputType, inputData) {
        if (this.subScreen === Screen.helpScreen && (inputType === "keydown" || inputType === 'click')) {
            this.subScreen.handleInput(inputType, inputData)
            return
        }
        if (inputType === 'keydown') {
            if (this.gameEnded) {
                if (inputData.key === 'Enter') {
                    Game.switchScreen(Screen.loseScreen)
                }
            } else {
                if (this.subScreen) {
                    this.subScreen.handleInput(inputType, inputData)
                    return
                }
                if (inputData.key === 'ArrowLeft') {
                    if (this.player.facing === 6) this.move(-1, 0, 0, 6)
                    else (this.player.facing = 6)
                } else if (inputData.key === 'ArrowRight') {
                    if (this.player.facing === 2) this.move(1, 0, 0, 2)
                    else (this.player.facing = 2)
                } else if (inputData.key === 'ArrowUp') {
                    if (this.player.facing === 0) this.move(0, -1, 0, 0)
                    else (this.player.facing = 0)
                } else if (inputData.key === 'ArrowDown') {
                    if (this.player.facing === 4) this.move(0, 1, 0, 4)
                    else (this.player.facing = 4)
                } else if (inputData.keyCode === 36) {
                    if (this.player.facing === 7) this.move(-1, -1, 0, 7)
                    else (this.player.facing = 7)
                } else if (inputData.keyCode === 33) {
                    if (this.player.facing === 1) this.move(1, -1, 0, 1)
                    else (this.player.facing = 1)
                } else if (inputData.keyCode === 34) {
                    if (this.player.facing === 3) this.move(1, 1, 0, 3)
                    else (this.player.facing = 3)
                } else if (inputData.keyCode === 35) {
                    if (this.player.facing === 5) this.move(-1, 1, 0, 5)
                    else (this.player.facing = 5)
                } else if (inputData.keyCode === 12) {
                    this.move(0, 0, 0, this.player.facing) // wait
                } else if (inputData.key === '.') {
                    this.move(0, 0, 1, this.player.facing)
                } else if (inputData.key === ',') {
                    this.move(0, 0, -1, this.player.facing)
                } else if (inputData.key === 'i') {
                    if (this.player.items.filter(x => x).length === 0) {
                        sendMessage(this.player, "You are not carrying anything!")
                        Game.refresh()
                    } else {
                        this.showInventory = !this.showInventory
                    }
                    return
                } else if (inputData.key === "h") {
                    this.setSubScreen(Screen.helpScreen)
                } else {
                    return
                }
                // Unlock the engine
                this.player.map.engine.unlock()
            }
        }
        if (inputType === 'pointermove') {
            this.infoCursor = this.display.eventToPosition(inputData)
            const topLeftX = this.offset.x
            const topLeftY = this.offset.y
            const x = topLeftX + this.infoCursor[0]
            const y = topLeftY + this.infoCursor[1]
            // if (x - topLeftX === this.infoCursor[0] && y - topLeftY === this.infoCursor[1]) this.cursorInfo = glyph.description
            let glyph: any = { description: 'unknown' }
            if (this.player.map.isExplored(x, y, this.player.z)) {
                glyph = this.player.map.getTile(x, y, this.player.z)
                const items = this.player.map.getItemsAt(x, y, this.player.z)
                if (items) {
                    glyph = items[items.length - 1]
                }
                if (this.player.map.getEntityAt(x, y, this.player.z)) {
                    glyph = this.player.map.getEntityAt(x, y, this.player.z)
                }
            }
            Game.updateCursor(glyph.description)
            // rgyaig message event from game to ui ux
        }
    },
    move(dX: number, dY: number, dZ: number, direction: number): void {
        const newX = this.player.x + dX
        const newY = this.player.y + dY
        const newZ = this.player.z + dZ
        this.player.facing = direction
        this.player.tryMove(newX, newY, newZ, this.player.map)
    },
    render(display) {
        this.display = display
        if (this.subScreen) {
            this.subScreen.render(display)
            return
        }
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value => screenWidth = value.screenSize.width)
        let screenHeight
        const screenHeightUnsub = Game.subscribe(value => screenHeight = value.screenSize.height)
        this.offset = this.getScreenOffsets()
        const topLeftX = this.offset.x
        const topLeftY = this.offset.y
        const visibleCells = {}
        // Find all visible cells and update the object
        this.player.map.fov[this.player.z].compute90(
            this.player.x, this.player.y,
            this.player.sightRadius, this.player.facing,
            (x, y, radius, visibility) => {
                if (visibility > 0) {
                    visibleCells[x + ',' + y] = true
                    this.player.map.setExplored(x, y, this.player.z, true)
                }
            })
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                let glyph: any = { description: 'unknown' }
                if (this.player.map.isExplored(x, y, this.player.z)) {
                    glyph = this.player.map.getTile(x, y, this.player.z)
                    let foreground = glyph.foreground
                    if (visibleCells[x + ',' + y]) {
                        const items = this.player.map.getItemsAt(x, y, this.player.z)
                        if (items) {
                            glyph = items[items.length - 1]
                        }
                        if (this.player.map.getEntityAt(x, y, this.player.z)) {
                            glyph = this.player.map.getEntityAt(x, y, this.player.z)
                        }
                        foreground = glyph.foreground
                    } else {
                        foreground = 'darkGray'
                    }
                    display.draw(x - topLeftX, y - topLeftY,
                        glyph.character,
                        foreground,
                        glyph.background)
                }
            }
        }
        screenWidthUnsub()
        screenHeightUnsub()
    },
    setSubScreen(subScreen) {
        this.subScreen = subScreen
        Game.refresh()
    },
    showItemsSubScreen(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this.player, items) > 0) {
            this.setSubScreen(subScreen)
        } else {
            sendMessage(this.player, emptyMessage)
            Game.refresh()
        }
    }
}
Screen.startScreen = {
    enter() { console.log('Entered start screen.') },
    exit() { console.log('Exited start screen.') },
    handleInput(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.playScreen)
            } else if (inputData.key === "h") {
                Screen.playScreen.setSubScreen(Screen.helpScreen)
                Game.switchScreen(Screen.playScreen)
            }
        }
        if (inputType === 'click') {
            Game.switchScreen(Screen.playScreen)
        }
    },
    render(display) {
        display.drawText(1, 1, '%c{yellow}Croplike')
        display.drawText(1, 2, '%c{goldenrod} a roguelike')
        display.drawText(1, 3, '%c{darkorange}on farming and letting go')
        display.drawText(1, 4, '%c{darkred}dungeon proof of concept')
        display.drawText(1, 5, '%c{yellow}Press %c{goldenrod}Enter%c{yellow} to start')
        display.drawText(1, 6, '%c{goldenrod}double click %c{yellow}for fullscreen!')
        display.drawText(1, 7, '%c{goldenrod}h%c{yellow} for help screen')
        display.drawText(1, 8, '%c{yellow}mobile controls... inc')
    }
}
Screen.winScreen = {
    enter() { console.log('Entered win screen.') },
    exit() { console.log('Exited win screen.') },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    },
    render(display) {
        for (let i = 0; i < 22; i++) {
            const r = Math.round(Math.random() * 255)
            const g = Math.round(Math.random() * 255)
            const b = Math.round(Math.random() * 255)
            display.drawText(2, i + 1, 'You win!')
        }
    }
}