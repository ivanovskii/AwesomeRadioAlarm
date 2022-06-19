import * as React from 'react';
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';

import notifee from '@notifee/react-native';
import {
  setAlarm,
  stopAlarm,
  onCreateTriggerNotification,
} from '../Notifications.js';

import {Database} from '../DatabaseService';
import Moment from 'moment';

notifee.onForegroundEvent(async ({type, detail}) => {
  setAlarm(type, detail);
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  setAlarm(type, detail);
});

var db = new Database('alarms', '~alarms.db', 'alarms');

class HomeScreen extends React.Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    this.setState({data: await db.all()});
  }

  async componentDidUpdate() {
    if (this.props.route.params) {
      let item = this.props.route.params.item;
      switch (this.props.route.params.op) {
        case 'create':
          this.createAlarm(item);
          break;
        case 'edit':
          this.editAlarm(item);
          break;
        case 'delete':
          this.deleteAlarm(item);
          break;
      }
      this.setState({data: await db.all()});
    }
  }

  async createAlarm(item) {
    this.props.route.params.op = null;
    if (item.time != null) {
      await db.insert(item);
      onCreateTriggerNotification(item.id, item.time, item.radio);
    }
  }

  async editAlarm(item) {
    this.props.route.params.op = null;
    await db.update(item);
    stopAlarm();
    notifee.cancelTriggerNotification(String(item.id));
    onCreateTriggerNotification(item.id, item.time, item.radio);
  }

  async deleteAlarm(item) {
    this.props.route.params.op = null;
    await db.delete(item.id);
    stopAlarm();
    notifee.cancelNotification(String(item.id));
  }

  async onChangeSwitch(value, item) {
    if (value) {
      onCreateTriggerNotification(item.id, item.time, item.radio);
    } else {
      stopAlarm();
      notifee.cancelNotification(String(item.id));
    }
    item.isEnabled = Number(value);
    await db.update(item);
    this.setState({data: await db.all()});
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Alarm', {op: 'edit', item: item});
        }}>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.clockText}>
              {Moment(Date.parse(item.time)).format('HH:mm')}
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
            onValueChange={value => {
              this.onChangeSwitch(value, item);
            }}
            value={Boolean(item.isEnabled)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />
        <Button
          title="New alarm"
          onPress={() =>
            this.props.navigation.navigate('Alarm', {op: 'create'})
          }
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

export {HomeScreen};
