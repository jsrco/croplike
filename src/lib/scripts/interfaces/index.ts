export interface MapProperties {
    height: number, // total map height:y
    width: number //  total map width:x
}
export interface Mouse {
    radius: number,
    x: number,
    y: number,
}
export interface Position {
    x: number,
    y: number,
}
export interface TileOptions {
    char: string,
    explorable: boolean,
    explored: boolean,
    fillStyle: string,
    lightPasses:boolean,
    name:string,
    strokeStyle: string,
}