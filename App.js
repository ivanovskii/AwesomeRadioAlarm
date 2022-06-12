import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Moment from 'moment';
import {Button, View, Text, FlatList, StyleSheet, Switch} from 'react-native';
import {AlarmScreen} from './components';

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

class HomeScreen extends React.Component {
  state = {
    data: [
      {id: 0, time: Date(), description: 'wake up', isEnabled: false},
      {id: 1, time: Date(), description: '', isEnabled: true},
      {id: 2, time: Date(), description: 'go to bed', isEnabled: false},
    ],
  };

  constructor(props) {
    super(props);
    console.log('constructor');
  }

  componentDidMount = async () => {
    console.log('componentDidMount');
  };

  componentDidUpdate = async () => {
    console.log('componentDidUpdate');
  };

  componentWillUnmount = async () => {
    console.log('componentWillUnmount');
  };

  renderItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        <View>
          <Text style={styles.clockText}>
            {Moment(item.time).format('HH:mm')}
          </Text>
          {item.description == '' ? (
            <Text style={styles.subtitle}>No description</Text>
          ) : (
            <Text style={styles.subtitle}>{item.description}</Text>
          )}
        </View>
        <Switch
          trackColor={{true: '#c0d8ff', false: '#d1d1d1'}}
          thumbColor={item.isEnabled ? '#6495ED' : '#f4f3f4'}
          onValueChange={() => {}}
          value={item.isEnabled}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />
        <Button
          title="New alarm"
          onPress={() => this.props.navigation.navigate('Alarm')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.4,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    minHeight: 90,
  },
  clockText: {
    color: 'black',
    fontSize: 30,
  },
  subtitle: {
    color: 'gray',
    width: 200,
  },
});

export default App;
