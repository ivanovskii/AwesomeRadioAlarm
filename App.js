import * as React from 'react';
import {Button, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          title="New alarm"
          onPress={() => this.props.navigation.navigate('Alarm')}
        />
      </View>
    );
  }
}

class AlarmScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          title="OK"
          onPress={() => this.props.navigation.navigate('Awesome Radio Alarm')}
        />
      </View>
    );
  }
}

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
