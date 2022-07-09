import Glyph from "./Glyph";

class DynamicGlyph extends Glyph {
  constructor(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    // Call glyph constructor with set of properties
    super(properties);
    // Instantiate any properties from the passed object
    this._name = properties["name"] || "";
    // Create an mixin object attached to entity based on name property
    this._attachedMixins = {};
    // Create similar object
    this._attachedMixinGroups = {};
    // Set up an object for listeners
    this._listeners = {};
    // Setup the object's mixins
    let mixins = properties["mixins"] || [];
    for (let i = 0; i < mixins.length; i++) {
      // Copy over all properties from each mixin but name, init, and listeners, make sure not to override a property that already exists
      for (let key in mixins[i]) {
        if (
          key !== "init" &&
          key !== "name" &&
          key !== "listeners" &&
          !this.hasOwnProperty(key)
        ) {
          this[key] = mixins[i][key];
        }
      }
      // Add name of mixin to attached mixins
      this._attachedMixins[mixins[i].name] = true;
      // If a group name is present, add it
      if (mixins[i].groupName) {
        this._attachedMixinGroups[mixins[i].groupName] = true;
      }
      // Add all listeners
      if (mixins[i].listeners) {
        for (let key in mixins[i].listeners) {
          // If key for this event is not in listeners array, add it
          if (!this._listeners[key]) {
            this._listeners[key] = [];
          }
          // Add listener, if we don't know it
          if (this._listeners[key].indexOf(mixins[i].listeners[key]) === -1) {
            this._listeners[key].push(mixins[i].listeners[key]);
          }
        }
      }
    }
    for (let i = 0; i < mixins.length; i++) {
      // Call init
      if (mixins[i].init) {
        mixins[i].init.call(this, properties);
      }
    }
  }
  describe() {
    return this._name;
  }
  describeA(capitalize) {
    // Optional parameter to capitalize the a/an.
    let prefixes = capitalize ? ["A", "An"] : ["a", "an"];
    let string = this.describe();
    let firstLetter = string.charAt(0).toLowerCase();
    // If word starts by a vowel, use an, else use a. Note that this is not perfect.
    let prefix = "aeiou".indexOf(firstLetter) >= 0 ? 1 : 0;

    return prefixes[prefix] + " " + string;
  }
  describeThe(capitalize) {
    let prefix = capitalize ? "The" : "the";
    return prefix + " " + this.describe();
  }
  details() {
    let details = [];
    let detailGroups = this.raiseEvent('details');
    // Iterate through each return value, grabbing the detaisl from the arrays.
    if (detailGroups) {
        for (let i = 0, l = detailGroups.length; i < l; i++) {
            if (detailGroups[i]) {
                for (let j = 0; j < detailGroups[i].length; j++) {
                    details.push(detailGroups[i][j].key + ': ' +  detailGroups[i][j].value);          
                }
            }
        }
    }
    return details.join(', ');
};
  getName() {
    return this._name;
  }
  hasMixin(obj) {
    // Allow passing mixin itself or name / group name as string
    if (typeof obj === "object") {
      return this._attachedMixins[obj.name];
    } else {
      return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
    }
  }
  raiseEvent(event) {
    // Check for listener, or  exit
    if (!this._listeners[event]) {
      return;
    }
    // Extract arguments passed, removing event name
    let args = Array.prototype.slice.call(arguments, 1);
    // Invoke each listener, with this entity as the context and the arguments
    let results = [];
    for (let i = 0; i < this._listeners[event].length; i++) {
      results.push(this._listeners[event][i].apply(this, args));
    }
    return results;
  }
  setName(name) {
    this._name = name;
  }
}

export default DynamicGlyph;
