class Repository {
  constructor(name, ctor) {
    this._ctor = ctor;
    this._name = name;
    this._randomTemplates = {};
    this._templates = {};
  }
  // Create an object based on template
  create(name, extraProperties) {
    if (!this._templates[name]) {
        throw new Error("No template named '" + name + "' in repository '" +
            this._name + "'");
    }
    // Copy the template
    let template = this._templates[name];
    // Apply extra properties
    if (extraProperties) {
        for (let key in extraProperties) {
            template[key] = extraProperties[key];
        }
    }
    // Create object, passing the template as an argument
    return new this._ctor(template);
  }
  // Create object based on random template
  createRandom() {
    // Pick random key, create object based off key
    let keys = Object.keys(this._randomTemplates)
    return this.create(keys[keys.length * Math.random() << 0]);
  }
  // Define a new template
  define(name, template, options) {
    this._templates[name] = template;
    // Apply options
    let disableRandomCreation = options && options['disableRandomCreation'];
    if (!disableRandomCreation) {
        this._randomTemplates[name] = template;
    }
  }
}

export default Repository;
