import { types } from 'mobx-state-tree'
// import routes from './routes.js'
// import LayoutStoreMixin from './LayoutStoreMixin.js'
import { ChatStore } from './ChatStore.js'

// const landingPageStore = routes['/'].store.create()
// const defaultCurrentView = landingPageStore.toJSON()

export const RootStore = types.compose(
    types
    .model('RootStore', {
        currentView: types.optional(types.union.apply(this, [ChatStore]), {})
    })
    .actions(self => ({
        setCurrentView (view) {
            self.currentView = view
        }
    }))
)

export default RootStore
