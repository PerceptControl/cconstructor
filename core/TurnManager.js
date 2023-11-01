module.exports = class TurnManager {
  #current = 0

  get Turn() {
    return this.#current
  }

  NextTurn() {
    this.#current++
  }
}
