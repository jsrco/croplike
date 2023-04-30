export class LocalStorageManager<T> {
    localStorageKey: string
    data: T | {}
    constructor(localStorageKey: string) {
        this.localStorageKey = localStorageKey
        const storedData = localStorage.getItem(this.localStorageKey)
        if (storedData) {
            this.data = JSON.parse(storedData)
        } else {
            this.data = {}
        }
    }
    clearData(): void {
        this.data = {}
        localStorage.removeItem(this.localStorageKey)
    }
    getData(): T | {} {
        return this.data
    }
    saveData(data: T): void {
        this.data = { ...this.data, ...data }
        const serializedData = JSON.stringify(data)
        localStorage.setItem(this.localStorageKey, serializedData)
    }
}
