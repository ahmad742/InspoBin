import "react-native-gesture-handler"
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Navigator from './src/Stacks/navigator'
import { store, persistor } from './src/Redux/Store/Index'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreAllLogs();

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const App = () => {

 

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}>
        {/* <View style={{ flex: 1 }}> */}
        <Navigator />
        {/* </View> */}
      </PersistGate>
    </Provider>


  )
}

export default App

