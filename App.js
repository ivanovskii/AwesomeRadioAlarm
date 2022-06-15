import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AlarmScreen, HomeScreen} from './Components/Screens';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Awesome Radio Alarm" component={HomeScreen} />
        <Stack.Screen name="Alarm" component={AlarmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
