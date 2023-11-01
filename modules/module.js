const History = require('../core/History')

module.exports = class Module {
  /**
   * @type {Map<string, EventCard}
   */
  #events = new Map()

  /**
   * @type {Map<string, FieldRecord<unknown>>}
   */
  #fields = new Map()

  /**
   * @type {string}
   */
  #name = ''

  constructor(name) {
    this.#name = name
  }

  /**
   * @param {string} event
   * @param {(history: History) => ExecuteResult} callback
   */
  on(event, callback) {
    this.#events.set(event, {
      Name: event,
      Module: this.#name,
      Callback: callback,
    })
  }

  get Name() {
    return this.#name
  }

  /**
   * @param {{name: string, set: (val) => ExecuteResult, get: () => unknown}} field
   */
  set Field(field) {
    this.#fields.set(field.name, {
      Name: field.name,
      Type: typeof field.get(),
      Set: field.set,
      Get: field.get,
    })
  }

  Fields() {
    return Array.from(this.#fields.values())
  }

  Events() {
    return Array.from(this.#events.values())
  }
}
