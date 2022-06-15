import * as React from 'react';
import {Button, View, Text, TextInput, StyleSheet} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

class AlarmScreen extends React.Component {
  state = {
    id: 0,
    time: null,
    description: '',
    isEnabled: 1,
    radio: '',
    showPicker: false,
  };

  async componentDidMount() {
    if (this.props.route.params) {
      if (this.props.route.params.op == 'edit') {
        this.setState(this.props.route.params.item);
      }
    }
  }

  setDate = (event, date) => {
    this.state.showPicker = false;
    this.state.time = date.toString();
    this.setState(this.state);
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={{marginHorizontal: 50}}>
          {this.state.time == null ? (
            <Text style={styles.time}>No time</Text>
          ) : (
            <Text style={styles.time}>
              {Moment(Date.parse(this.state.time)).format('HH:mm')}
            </Text>
          )}
          {this.state.showPicker && (
            <RNDateTimePicker
              mode="time"
              value={new Date()}
              onChange={this.setDate}
            />
          )}
          <Button
            title="Choose time"
            color="#2196f3"
            onPress={() => {
              (this.state.showPicker = true), this.setState(this.state);
            }}
          />
          <TextInput
            style={styles.textField}
            onChangeText={text => {
              this.state.description = text;
              this.setState(this.state);
            }}
            value={this.state.description}
            placeholder="Description"
          />
        </View>
        <View>
          {this.props.route.params.op == 'edit' ? (
            <Button
              title="Delete"
              color="#D2042D"
              onPress={() =>
                this.props.navigation.navigate('Awesome Radio Alarm', {
                  op: 'delete',
                  item: this.state,
                })
              }
            />
          ) : null}
          <Button
            title="OK"
            onPress={() =>
              this.props.navigation.navigate('Awesome Radio Alarm', {
                op: this.props.route.params.op,
                item: this.state,
              })
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textField: {
    marginVertical: 30,
    borderBottomColor: '#2196f3',
    borderBottomWidth: 1,
  },
  time: {
    alignSelf: 'center',
    marginVertical: 60,
    color: 'black',
    fontSize: 50,
  },
});

export {AlarmScreen};
