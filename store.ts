import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

//
// Initial State...
//

const initialState = {
  token: '',
  domain: ''
}

//
// Reducer...
//

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SETTOKEN':
      return {
        ...state,
        token: action.value
      }
    case 'SETDOMAIN':
      return {
        ...state,
        domain: action.value
      }
    default:
      return state
  }
}

//
// Store...
//

// const store = createStore(reducer, applyMiddleware(thunkMiddleware));
// export { store };



const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer)
let persistor = persistStore(store)

export { store, persistor };