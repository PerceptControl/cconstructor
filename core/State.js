module.exports = class State {
  /**
   * @type {Map<string, FieldRecord<unknown>>}
   */
  #fieldMap = new Map()
  /**
   *
   * @param {{Fields: () => FieldRecord<unknown>[], Name: string}} module
   */
  use(module) {
    for (let field of module.Fields()) {
      this.#fieldMap.set(`${module.Name}:${field.Name}`, field)
    }
  }

  /**
   *
   * @param {StateQuery<unknown>[]} transaction
   */
  push(transaction) {
    for (let query of transaction) {
      if (!this.#fieldMap.has(query.Field)) continue
      let field = this.#fieldMap.get(query.Field)

      if (field.Type != query.Type) continue
      let prev = field.Get()
      let current = query.Compute(prev)

      field.Set(current)
      query.Value = {
        Prev: prev,
        Current: current,
      }
    }
  }

  /**
   *
   * @param {string} field
   */
  read(field) {
    return this.#fieldMap.get(field).Get()
  }
}
