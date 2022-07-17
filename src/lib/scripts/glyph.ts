export class Glyph {
    background: string
    character: string
    foreground: string

    constructor(properties: { character?: string; foreground?: string; background?: string; }) {
        // Instantiate properties to default if they weren't passed
        properties = properties || {}
        this.character = properties.character || ' '
        this.foreground = properties.foreground || 'white'
        this.background = properties.background || '#1d1d1d'
    }
}

