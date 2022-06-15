import Moment from 'moment';
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
import {openDatabase} from 'react-native-sqlite-storage';
import {Database} from '../DatabaseService';

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
      if (this.props.route.params.op == 'edit') {
        this.props.route.params.op = null;
        let item = this.props.route.params.item;
        await db.update(
          item.id,
          item.time,
          item.description,
          item.radio,
          item.isEnabled,
        );
      }
      if (this.props.route.params.op == 'create') {
        this.props.route.params.op = null;
        let item = this.props.route.params.item;
        if (item.time != null)
          await db.insert(
            item.time,
            item.description,
            item.radio,
            item.isEnabled,
          );
      }
      if (this.props.route.params.op == 'delete') {
        this.props.route.params.op = null;
        await db.delete(this.props.route.params.item.id);
      }
    }
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
            onValueChange={() => {}}
            value={item.isEnabled == 1}
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
