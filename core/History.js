const State = require('./State')
const TurnManager = require('./TurnManager')

module.exports = class History {
  /**
   * @typedef {{Turn: number, Transactions: Transaction[]}} Page
   */

  /**
   * @type {Page[]}
   */
  #pages = []

  /**
   * @type {State}
   */
  #userState = null

  /**
   * @type {TurnManager}
   */
  #turnManager = null

  get State() {
    return this.#userState
  }

  get Turn() {
    return this.#turnManager.Turn
  }

  get CurrentPage() {
    if (this.#pages.length == 0) return this.#createPage()

    let Page = this.#pages[this.#pages.length - 1]
    if (Page.Turn == this.Turn) return Page

    throw Error('Invalid turn')
  }

  /**
   *
   * @param {State} state
   * @param {TurnManager} turnManager
   */
  constructor(state, turnManager) {
    ;(this.#userState = state), (this.#turnManager = turnManager)
  }

  /**
   * @param {Transaction[]} transactions
   * @returns {ExecuteResult}
   */
  Store(transactions) {
    const Page = this.CurrentPage
    for (let transaction of transactions) {
      this.#userState.push(transaction.Changes)
      Page.Transactions.push(transaction)
      if (transaction.NextTurn) this.EndTurn()
    }

    return {
      ok: true,
    }
  }

  /**
   *
   * @param {number} from
   * @param {number} to
   */
  Search(from, to) {
    /**
     * @type {Page[]}
     */
    const pages = []
    for (let [index, page] of this.#pages.entries()) {
      if (index > from && index < to) pages.push(page)
    }

    return pages
  }

  EndTurn() {
    this.#turnManager.NextTurn()
    this.#createPage()
  }

  #createPage() {
    this.#pages[this.#pages.length] = {
      Turn: this.Turn,
      Transactions: new Array(),
    }
    return this.#pages[this.#pages.length - 1]
  }
}
