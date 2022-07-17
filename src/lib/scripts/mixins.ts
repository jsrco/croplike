// Create Mixins namespace
export class Mixins {
    static Moveable: { name: string; tryMove(x: any, y: any, map: any): boolean; };
}


// Tile Repo
// Make sure to add all new tiles as static Tile properties
// Define our Moveable mixin
Mixins.Moveable = {
    name: 'Moveable',
    tryMove(x, y, map) {
        const tile = map.getTile({ x, y })
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable) {
            // Update the entity's position
            this.position.x = x;
            this.position.y = y;
            return true;
        // Check if the tile is diggable, and
        // if so try to dig it
        } else if (tile.isDiggable) {
            map.dig(x, y);
            return true;
        }
        return false;
    }
};
