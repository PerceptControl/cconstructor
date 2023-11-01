const History = require('./History')

module.exports = class ModuleMager {
  /**
   * @typedef {{Notify: (event: string, history: History) => ExecuteResult, Events: EventCard[], Name: string}} Module
   */

  /**
   * @type {History}
   */
  #history = null

  /**
   * @type {Map<string, Module>}
   */
  #modules = new Map()

  /**
   * @type {Map<string, EventCard[]>}
   */
  #events = new Map()
  constructor(history) {
    this.#history = history
  }

  /**
   * @param {Module} module
   * @returns {ExecuteResult}
   */
  register(module) {
    this.#history.State.use(module)
    for (let event of module.Events()) {
      this.#storeEvent(module, event)
    }
    return { ok: true }
  }

  /**
   * @param {Module} module
   * @returns {ExecuteResult}
   */
  forget(module) {
    this.#removeModule(module)
    return { ok: true }
  }

  /**
   * @param {string} event
   * @returns {ExecuteResult}
   */
  send(eventName) {
    if (!this.#events.has(eventName))
      return { ok: false, error: new Error('No subscribers on event') }
    for (let event of this.#events.get(eventName)) {
      let result = event.Callback(this.#history)
      if (!result.ok) return result
    }

    return { ok: true }
  }

  /**
   *
   * @param {Module} module
   * @param {EventCard} event
   */
  #storeEvent(module, event) {
    if (!this.#events.has(event.Name)) this.#events.set(event.Name, [event])
    else this.#events.get(event.Name).push(event)

    if (!this.#modules.has(module.Name)) this.#modules.set(module.Name, module)
  }

  /**
   * @param {Module} module
   */
  #removeModule(module) {
    if (!this.#modules.has(module.Name)) return
    const events = this.#modules.get(module.Name).Events

    for (let event of events)
      this.#events.get(event.Name).splice(
        this.#events.get(event.Name).findIndex((elem) => {
          return event.Name == elem.Name && event.Module == elem.Module
        }),
        1,
      )
  }
}
