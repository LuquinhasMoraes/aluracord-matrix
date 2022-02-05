import { createContext, useContext, useState, useEffect } from 'react'
import { applySnapshot } from 'mobx-state-tree'
import { initializeStore } from '../../stores/store'
// import { initializeStore } from '~/store.js'

export const StoreContext = createContext()

export function StoreProvider ({ children, initialSnapshot }) {
  const [store] = useState(initializeStore())
  useEffect(() => {
    if (initialSnapshot) {
      applySnapshot(store, initialSnapshot)
    }
  }, [initialSnapshot])
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore (initialSnapshot) {
  const store = useContext(StoreContext)
  if (store === undefined) {
    throw new Error('`useStore` must be used within `StoreProvider`.')
  }
  useEffect(() => {
    if (initialSnapshot) {
      applySnapshot(store, initialSnapshot)
    }
  }, [initialSnapshot])
  return store
}
