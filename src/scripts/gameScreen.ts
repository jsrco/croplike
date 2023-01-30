import * as PIXI from 'pixi.js'

export class GameScreen extends PIXI.Application {
    stageName: string;
    constructor(props: { appOptions: PIXI.IApplicationOptions; stageName: string; }) {
        super(props.appOptions)
        this.stageName = props.stageName
    }
}