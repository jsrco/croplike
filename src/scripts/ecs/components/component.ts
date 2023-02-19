export interface Component {
    readonly name: string
    update(delta: number): void
}
