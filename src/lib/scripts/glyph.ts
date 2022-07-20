export class Glyph {
    background: string
    character: string
    foreground: string
    constructor(properties: { background?: string, character?: string, foreground?: string }) {
        properties = properties || {}
        this.background = properties.background || '#1d1d1d'
        this.character = properties.character || ' '
        this.foreground = properties.foreground || 'white'
    }
}