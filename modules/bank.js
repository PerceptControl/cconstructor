const CModule = require('./module')

class Bank extends CModule {
  accVal = 0
  constructor() {
    super('bank')
    super.Field = {
      name: 'accVal',
      get: function () {
        return this.accVal
      }.bind(this),
      set: function (val) {
        this.accVal = val
        return { ok: true }
      }.bind(this),
    }
  }
}

const BankModule = new Bank()
BankModule.on('buy', (history) => {
  console.log('buy event')
  for (let transaction of history.CurrentPage.Transactions) {
    for (change of transaction.Changes) {
      if (change.Field == `${BankModule.Name}:accVal`) {
        if (change.Value?.Current < 0)
          return { ok: false, error: new Error('Failed transaction') }
      }
    }
  }

  return { ok: true }
})

module.exports = BankModule
