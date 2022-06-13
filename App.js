import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Moment from 'moment';
import {Button, View, Text, FlatList, StyleSheet, Switch} from 'react-native';
import {AlarmScreen} from './components';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'alarms.db', createFromLocation: '~alarms.db'});

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
      {id: 0, time: Date(2020), description: 'wake up', isEnabled: false},
      {id: 1, time: Date(2020), description: '', isEnabled: true},
      {id: 2, time: Date(2020), description: 'go to bed', isEnabled: false},
    ],
  };

  constructor(props) {
    super(props);
  }

  insertItem = (time, description, radio) => {
    return new Promise(() => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO alarms (time, description, isEnabled, radio) VALUES (?, ?, ?, ?)',
          [time, description, 1, radio],
          (tx, results) => {
            console.log('insertion: ' + results.insertId);
          },
        );
      });
    });
  };

  selectItems() {
    return new Promise(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM alarms', [], (tx, results) => {
          var len = results.rows.length;
          this.state.data = [];
          for (let i = 0; i < len; i++) {
            let item = results.rows.item(i);
            this.state.data.push({
              id: item.id,
              time: item.time,
              description: item.description,
              isActive: item.isActive,
              radio: item.radio,
            });
          }
          this.state.isChanged = false;
          this.setState(this.state);
        });
      });
    });
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
