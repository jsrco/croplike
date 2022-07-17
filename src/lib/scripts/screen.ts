import { Game } from '$lib/scripts/diesel'
import { Templates } from './entities'
import { Entity } from './entity'
import { Map } from './map'
import { Color, Map as ROTMap } from 'rot-js'
import { Tile } from './tile'

export const Screen: any = {}

// Define our winning screen
Screen.loseScreen = {
    enter() { console.log('Entered lose screen.') },
    exit() { console.log('Exited lose screen.') },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    },
    render(display) {
        // Render our prompt to the screen
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, '%b{red}You lose!')
        }
    }
}

// Define our playing screen
Screen.playScreen = {
    map: null,
    player: null,
    enter() {
        console.log('Entered play screen.')
        const map = []
        const mapWidth = 200
        const mapHeight = 200
        for (let x = 0; x < mapWidth; x++) {
            // Create the nested array for the y values
            map.push([])
            // Add all the tiles
            for (let y = 0; y < mapHeight; y++) {
                map[x].push(Tile.nullTile)
            }
        }
        // Setup the map generator
        const generator = new ROTMap.Cellular(mapWidth, mapHeight)
        generator.randomize(0.5)
        const totalIterations = 3
        // Iteratively smoothen the map
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create()
        }
        // Smoothen it one last time and then update our map
        generator.create(function (x, y, v) {
            if (v === 1) {
                map[x][y] = Tile.floorTile
            } else {
                map[x][y] = Tile.wallTile
            }
        })
        // Create our map from the tiles and player
        this.player = new Entity(Templates.PlayerTemplate);
        this.map = new Map(map, this.player);
        // Start the map's engine
        this.map.engine.start();
    },
    exit() { console.log('Exited play screen.') },
    handleInput(inputType, inputData) {
        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.winScreen)
            } else if (inputData.key === 'Escape') {
                Game.switchScreen(Screen.loseScreen)
            } else {
                // Movement
                if (inputData.key === 'ArrowLeft') {
                    this.move(-1, 0)
                } else if (inputData.key === 'ArrowRight') {
                    this.move(1, 0)
                } else if (inputData.key === 'ArrowUp') {
                    this.move(0, -1)
                } else if (inputData.key === 'ArrowDown') {
                    this.move(0, 1)
                }
                // Unlock the engine
                this.map.engine.unlock();
            }
        }
    },
    move(dX, dY) {
        const newX = this.player.x + dX;
        const newY = this.player.y + dY;
        // Try to move to the new cell
        this.player.tryMove(newX, newY, this.map)
    },
    render(display) {
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value => screenWidth = value.screenSize.width)
        let screenHeight
        const screenHeightUnsub = Game.subscribe(value => screenHeight = value.screenSize.height)
        // Make sure the x-axis doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this.player.x - Math.floor(screenWidth / 2))
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this.map.width - screenWidth)
        // Make sure the y-axis doesn't above the top bound
        let topLeftY = Math.max(0, this.player.y - Math.floor(screenHeight / 2))
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this.map.height - screenHeight)
        // Iterate through all visible map cells
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                const glyph = this.map.tiles[x][y]
                display.draw(x - topLeftX, y - topLeftY,
                    glyph.character,
                    glyph.foreground,
                    glyph.background)
            }
        }
        // Render the entities
        const entities = this.map.entities;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            // Only render the entitiy if they would show up on the screen
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

// Define our initial start screen
Screen.startScreen = {
    enter() { console.log('Entered start screen.') },
    exit() { console.log('Exited start screen.') },
    handleInput(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.playScreen)
            }
        }
    },
    render(display) {
        // Render our prompt to the screen
        display.drawText(1, 1, '%c{yellow}Croplike')
        display.drawText(1, 2, '%c{goldenrod} a roguelike')
        display.drawText(1, 3, '%c{darkorange}on farming and letting go')
        display.drawText(1, 4, '%c{goldenrod}Press Enter to start')
        display.drawText(1, 5, '%c{yellow}double click for fullscreen!')
    }
}

// Define our winning screen
Screen.winScreen = {
    enter() { console.log('Entered win screen.') },
    exit() { console.log('Exited win screen.') },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    },
    render(display) {
        // Render our prompt to the screen
        for (let i = 0; i < 22; i++) {
            // Generate random background colors
            const r = Math.round(Math.random() * 255)
            const g = Math.round(Math.random() * 255)
            const b = Math.round(Math.random() * 255)
            const background = Color.toRGB([r, g, b])
            display.drawText(2, i + 1, '%b{' + background + '}You win!')
        }
    }
}