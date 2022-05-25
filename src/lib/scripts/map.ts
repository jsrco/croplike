import { ColorSwatch } from "$lib/scripts/colorSwatch";
import type { MapProperties } from '$lib/scripts/interfaces/index'

export class Map {
    mapHeight: number;
    mapWidth: number;
    map: Array<unknown>;
    constructor(mapProperties: MapProperties) {
        this.mapHeight = mapProperties.mapHeight;
        this.mapWidth = mapProperties.mapWidth;
        this.map = [];
        this.builder();
    }
    builder(): void {
        for (let x = 0; x < this.mapWidth; x++) {
            this.map.push([]);
            for (let y = 0; y < this.mapHeight; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.mapWidth - 1 ||
                    y === this.mapHeight - 1
                ) {
                    this.map[x][y] = {
                        fillStyle: ColorSwatch.red[9],
                        size: 25,
                        strokeStyle: ColorSwatch.red[9],
                        x: x,
                        y: y,
                    };
                } else {
                    this.map[x][y] = {
                        fillStyle: ColorSwatch.green[9],
                        size: 25,
                        strokeStyle: ColorSwatch.green[9],
                        x: x,
                        y: y,
                    };
                }
            }
        }
    }
}



