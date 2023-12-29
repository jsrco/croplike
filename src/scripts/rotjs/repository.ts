import { randomize } from "./utility"

export class Repository {
    ctor: any
    name: any
    randomTemplates: any
    templates: any
    constructor(name, ctor) {
      this.ctor = ctor
      this.name = name
      this.randomTemplates = {}
      this.templates = {}
    }
    // Create an object based on template
    create(name, extraProperties?) {
      if (!this.templates[name]) {
          throw new Error("No template named '" + name + "' in repository '" +
              this.name + "'")
      }
      const template = this.templates[name]
      if (extraProperties) {
          for (const key in extraProperties) {
              template[key] = extraProperties[key]
          }
      }
      return new this.ctor(template)
    }
    createRandom() {
        return this.create(randomize(Object.keys(this.randomTemplates))[0])
    }
    define(name, template, options?) {
      this.templates[name] = template
      const disableRandomCreation = options && options['disableRandomCreation']
      if (!disableRandomCreation) {
          this.randomTemplates[name] = template
      }
    }
  }