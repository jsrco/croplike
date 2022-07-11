export class Tile {
    char
    properties: Object

    constructor(properties) {
        // Instantiate properties to default if they weren't passed
        properties = properties || {};
        this.char = properties || ' ';
        this.foreground = properties.foreground || 'white';
        this.background = properties.background || '#1d1d1d';
    }
}

