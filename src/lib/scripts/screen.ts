import { Game } from '$lib/scripts/diesel'
import { Templates } from './entities'
import { Entity } from './entity'
import { Map } from './map'
import { Color, Map as ROTMap } from 'rot-js'
import { Tile } from './tile'
export const Screen: any = {}
Screen.loseScreen = {
    enter() { console.log('Entered lose screen.') },
    exit() { console.log('Exited lose screen.') },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    },
    render(display) {
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, '%b{red}You lose!')
        }
    }
}
Screen.playScreen = {
    map: null,
    player: null,
    enter() {
        console.log('Entered play screen.')
        const map = []
        const mapWidth = 200
        const mapHeight = 200
        for (let x = 0; x < mapWidth; x++) {
            map.push([])
            for (let y = 0; y < mapHeight; y++) {
                map[x].push(Tile.nullTile)
            }
        }
        const generator = new ROTMap.Cellular(mapWidth, mapHeight)
        generator.randomize(0.5)
        const totalIterations = 3
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create()
        }
        generator.create(function (x, y, v) {
            if (v === 1) {
                map[x][y] = Tile.floorTile
            } else {
                map[x][y] = Tile.wallTile
            }
        })
        this.player = new Entity(Templates.PlayerTemplate)
        this.map = new Map(map, this.player)
        this.map.engine.start()
    },
    exit() { console.log('Exited play screen.') },
    handleInput(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.winScreen)
            } else if (inputData.key === 'Escape') {
                Game.switchScreen(Screen.loseScreen)
            } else {
                if (inputData.key === 'ArrowLeft') {
                    this.move(-1, 0)
                } else if (inputData.key === 'ArrowRight') {
                    this.move(1, 0)
                } else if (inputData.key === 'ArrowUp') {
                    this.move(0, -1)
                } else if (inputData.key === 'ArrowDown') {
                    this.move(0, 1)
                }
                this.map.engine.unlock();
            }
        }
    },
    move(dX, dY) {
        const newX = this.player.x + dX;
        const newY = this.player.y + dY;
        this.player.tryMove(newX, newY, this.map)
    },
    render(display) {
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value => screenWidth = value.screenSize.width)
        let screenHeight
        const screenHeightUnsub = Game.subscribe(value => screenHeight = value.screenSize.height)
        let topLeftX = Math.max(0, this.player.x - Math.floor(screenWidth / 2))
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth)
        let topLeftY = Math.max(0, this.player.y - Math.floor(screenHeight / 2))
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight)
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                const glyph = this.map.tiles[x][y]
                display.draw(x - topLeftX, y - topLeftY,
                    glyph.character,
                    glyph.foreground,
                    glyph.background)
            }
        }
        const entities = this.map.entities;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.x >= topLeftX && entity.y >= topLeftY &&
                entity.x < topLeftX + screenWidth &&
                entity.y < topLeftY + screenHeight) {
                display.draw(
                    entity.x - topLeftX,
                    entity.y - topLeftY,
                    entity.character,
                    entity.foreground,
                    entity.background
                );
            }
        }
        screenWidthUnsub()
        screenHeightUnsub()
    }
}
Screen.startScreen = {
    enter() { console.log('Entered start screen.') },
    exit() { console.log('Exited start screen.') },
    handleInput(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.key === 'Enter') {
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
        display.drawText(1, 4, '%c{goldenrod}Press Enter to start')
        display.drawText(1, 5, '%c{yellow}double click for fullscreen!')
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
            const background = Color.toRGB([r, g, b])
            display.drawText(2, i + 1, '%b{' + background + '}You win!')
        }
    }
}