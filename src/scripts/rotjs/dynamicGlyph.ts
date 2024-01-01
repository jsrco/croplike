import { Glyph } from './glyph'
export class DynamicGlyph extends Glyph {
    attachedMixins: any
    attachedMixinGroups: any
    description: string
    listeners: any
    name: string
    constructor(properties: { background?: string, character?: string, description?: string, foreground?: string, mixins?: any, name?: string }) {
        properties = properties || {}
        super(properties)
        this.description = properties.description || ''
        this.name = properties.name || ''
        this.attachedMixins = {}
        this.attachedMixinGroups = {}
        this.listeners = {}
        const Mixins = properties.mixins || []
        for (let i = 0; i < Mixins.length; i++) {
            for (const key in Mixins[i]) {
                // eslint-disable-next-line no-prototype-builtins
                if (key !== 'init' && key !== 'name' && key !== 'listeners' && !this.hasOwnProperty(key)) {
                    this[key] = Mixins[i][key]
                }
            }
            this.attachedMixins[Mixins[i].name] = true
            if (Mixins[i].groupName) {
                this.attachedMixinGroups[Mixins[i].groupName] = true
            }
            if (Mixins[i].listeners) {
                for (const key in Mixins[i].listeners) {
                  // If key for this event is not in listeners array, add it
                  if (!this.listeners[key]) {
                    this.listeners[key] = []
                  }
                  // Add listener, if we don't know it
                  if (this.listeners[key].indexOf(Mixins[i].listeners[key]) === -1) {
                    this.listeners[key].push(Mixins[i].listeners[key])
                  }
                }
              }
            if (Mixins[i].init) {
                Mixins[i].init.call(this, properties)
            }
        }
    }
    describe() {
        return this.name
    }
    describeA(capitalize: string): string {
        const prefixes = capitalize ? ['A', 'An'] : ['a', 'an']
        const string = this.describe()
        const firstLetter = string.charAt(0).toLowerCase()
        const prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0
        return prefixes[prefix] + ' ' + string
    }
    describeThe(capitalize) {
        const prefix = capitalize ? 'The' : 'the'
        return prefix + ' ' + this.describe()
    }
    details() {
        const details = []
        const detailGroups = this.raiseEvent('details')
        if (detailGroups) {
            for (let i = 0, l = detailGroups.length; i < l; i++) {
                if (detailGroups[i]) {
                    for (let j = 0; j < detailGroups[i].length; j++) {
                        details.push(detailGroups[i][j].key + ': ' +  detailGroups[i][j].value)          
                    }
                }
            }
        }
        return details.join(', ')
    }
    hasMixin(obj: any): any {
        if (typeof obj === 'object') {
            return this.attachedMixins[obj.name]
        } else {
            return this.attachedMixins[obj] || this.attachedMixinGroups[obj]
        }
    }
    raiseEvent(event) {
        // Make sure we have at least one listener, or else exit
        if (!this.listeners[event]) {
            return
        }
        // Extract any arguments passed, removing the event name
        // eslint-disable-next-line prefer-rest-params
        const args = Array.prototype.slice.call(arguments, 1)
        const results = []
        for (let i = 0; i < this.listeners[event].length; i++) {
            results.push(this.listeners[event][i].apply(this, args))
        }
        return results
    }
}