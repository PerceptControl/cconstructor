type Transaction = {
  Author: string,
  NextTurn: bool,
  Changes: StateQuery[]
}

type StateQuery<T> = {
  Field: string,
  Type: string,
  Compute: (prev: T) => T
  Value?: {
    Prev: T,
    Current: T
  }
}

type ExecuteResult ={ 
  ok: boolean,
  error?: Error
}

type FieldRecord<T> = {
  Name: string,
  Type: string,
  Set: (value: T) => ExecuteResult
  Get: () => T
}

type EventCard = {
  Name: string,
  Module: string,
  Callback: (history: History) => void
}