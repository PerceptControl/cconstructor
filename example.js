const History = require('./core/History')
const ModuleManager = require('./core/ModuleManager')
const State = require('./core/State')
const TurnManager = require('./core/TurnManager')
const BankModule = require('./modules/bank')

const state = new State()
const history = new History(state, new TurnManager())
const manager = new ModuleManager(history)

manager.register(BankModule)

history.Store([
  {
    Author: 'user',
    NextTurn: false,
    Changes: [
      { Field: 'bank:accVal', Type: typeof 0, Compute: (prev) => (prev -= 10) },
    ],
  },
])
console.log(manager.send('buy'))
