import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
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
  domain: '',
  user: {},
  courses: [],
  overdueAssignments: false,
  refresh: ''
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
    case 'SETREFRESH':
      return {
        ...state,
        refresh: action.value
      }
    case 'SETUSER':
      return {
        ...state,
        user: action.value
      }
    case 'SETDOMAIN':
      return {
        ...state,
        domain: action.value
      }
    case 'SETCOURSES':
      return {
        ...state,
        courses: action.value
      }
    case 'SETOVERDUE':
      return {
        ...state,
        overdueAssignments: action.value
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