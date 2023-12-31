export class LocalStorageManager<T> {

    data: T | {}
    localStorageKey: string

    constructor(localStorageKey: string) {
        this.localStorageKey = localStorageKey
        this.data = this.getData()
    }

    clearData(): void {
        this.data = {}
        localStorage.removeItem(this.localStorageKey)
    }

    getData(): T | {} {
        const storedData = localStorage.getItem(this.localStorageKey)
        if (storedData) {
            this.data = JSON.parse(storedData)
        } else {
            this.data = {}
        }
        return this.data
    }

    saveData(data: T): void {
        this.data = { ...this.data, ...data }
        const serializedData = JSON.stringify(data)
        localStorage.setItem(this.localStorageKey, serializedData)
    }

}