import Game from '$lib/scripts/diesel'
import Map from './map'
import { Color, Map as ROTMap } from 'rot-js'
import Tile from './tile'

export const Screen: any = {}

// Define our winning screen
Screen.loseScreen = {
    enter() { console.log('Entered lose screen.') },
    exit() { console.log('Exited lose screen.') },
    render(display) {
        // Render our prompt to the screen
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, '%b{red}You lose!')
        }
    },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    }
}

// Define our playing screen
Screen.playScreen = {
    map: null,
    enter() {
        console.log('Entered play screen.')
        const map = [];
        for (let x = 0; x < 500; x++) {
            // Create the nested array for the y values
            map.push([]);
            // Add all the tiles
            for (let y = 0; y < 500; y++) {
                map[x].push(Tile.nullTile);
            }
        }
        // Setup the map generator
        const generator = new ROTMap.Cellular(500, 500);
        generator.randomize(0.5);
        const totalIterations = 3;
        // Iteratively smoothen the map
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create();
        }
        // Smoothen it one last time and then update our map
        generator.create(function (x, y, v) {
            if (v === 1) {
                map[x][y] = Tile.floorTile;
            } else {
                map[x][y] = Tile.wallTile;
            }
        });
        // Create our map from the tiles
        this.map = new Map(map);
    },
    exit() { console.log('Exited play screen.') },
    render(display) {
        let screenWidth
        const screenWidthUnsub = Game.subscribe(value  => screenWidth = value.screenSize.width )
        let screenHeight
        const screenHeightUnsub = Game.subscribe(value  => screenHeight = value.screenSize.height )
        // Iterate through all map cells
        for (let x = 0; x < screenWidth; x++) {
            for (let y = 0; y < screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                const glyph = this.map.tiles[x][y];
                display.draw(x, y,
                    glyph.character,
                    glyph.foreground,
                    glyph.background);
            }
        }
        screenWidthUnsub()
        screenHeightUnsub()
    },
    handleInput(inputType, inputData) {
        if (inputType === 'click') {
            Game.switchScreen(Screen.winScreen);
        }
        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.winScreen)
            } else if (inputData.key === 'Escape') {
                Game.switchScreen(Screen.loseScreen)
            }
        }
    }
}

// Define our initial start screen
Screen.startScreen = {
    enter() { console.log('Entered start screen.') },
    exit() { console.log('Exited start screen.') },
    render(display) {
        // Render our prompt to the screen
        display.drawText(1, 1, '%c{yellow}Javascript Roguelike')
        display.drawText(1, 2, 'Press Enter to start!')
    },
    handleInput(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.key === 'Enter') {
                Game.switchScreen(Screen.playScreen);
            }
        }
        if (inputType === 'click') {
            Game.switchScreen(Screen.playScreen);
        }
    }
}

// Define our winning screen
Screen.winScreen = {
    enter() { console.log('Entered win screen.') },
    exit() { console.log('Exited win screen.') },
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
    },
    handleInput(inputType, inputData) {
        // Nothing to do here      
    }
}