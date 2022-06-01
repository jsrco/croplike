export interface Mouse {
    radius: number,
    x: number,
    y: number,
}
export interface Position {
    x: number,
    y: number,
}
export interface TileConfig {
    char: string,
    explorable: boolean,
    explored: boolean,
    fillStyle: string,
    lightPasses:boolean,
    name:string,
    position: Position,
    size: number,
    strokeStyle: string,
}