import { observable } from 'mobx'
import { onSnapshot, getSnapshot, applySnapshot } from 'mobx-state-tree'
import { ChatStore } from './ChatStore'
import RootStore from './RootStore'

const isServer = (typeof window === 'undefined')
let store
export function initializeStore (snapshot = null) {
    if (isServer || !store) {
      store = RootStore.create()
    }
    if (snapshot) applySnapshot(store, snapshot)
    if (isServer) return store

    window.store = store
    console.log(store);
    return store
  }