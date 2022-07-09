class Glyph {
    constructor(properties) {
        // Instantiate properties to default if they weren't passed
        properties = properties || {};
        this._char = properties['character'] || ' ';
        this._foreground = properties['foreground'] || 'white';
        this._background = properties['background'] || '#1d1d1d';
    }
    // Create standard getters for glyphs
    getBackground() {
        return this._background;
    }
    getChar() {
        return this._char;
    }
    getForeground() {
        return this._foreground;
    }
    getRepresentation() {
        return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._char +
            '%c{white}%b{black}';
    }
}

export default Glyph