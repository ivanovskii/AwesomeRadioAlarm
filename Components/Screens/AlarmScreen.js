import * as React from 'react';
import {Button, View, Text, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import notifee from '@notifee/react-native';
import {stopAlarm} from '../Notifications.js';
import {radio_src} from '../RadioSource.js';

class AlarmScreen extends React.Component {
  state = {
    id: 0,
    time: null,
    description: '',
    isEnabled: 1,
    radio: '0',
    showPicker: false,
  };

  async componentDidMount() {
    if (this.props.route.params) {
      if (this.props.route.params.op == 'edit') {
        this.setState(this.props.route.params.item);
      }
    }
  }

  datetimePickerSetDate = (event, date) => {
    date.setSeconds(0);
    this.state.showPicker = false;
    this.state.time = date.toString();
    this.setState(this.state);
  };

  pickerSetSelectedValue = itemValue => {
    this.state.radio = itemValue;
    this.setState(this.state);
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={{padding: 30, justifyContent: 'space-between'}}>
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
              onChange={this.datetimePickerSetDate}
            />
          )}
          <Button
            title="Choose time"
            color="#2196f3"
            onPress={() => {
              this.state.showPicker = true;
              this.setState(this.state);
            }}
          />
          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.radio}
              onValueChange={this.pickerSetSelectedValue}>
              {Object.keys(radio_src).map(key => {
                return (
                  <Picker.Item
                    label={radio_src[key].name}
                    value={key}
                    key={key}
                  />
                );
              })}
            </Picker>
          </View>
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
    backgroundColor: 'white',
  },
  picker: {
    marginTop: 30,
    backgroundColor: '#f3f6f4',
    borderRadius: 6,
  },
  textField: {
    marginTop: 30,
    backgroundColor: '#f3f6f4',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomColor: '#2196f3',
    borderBottomWidth: 0.4,
  },
  time: {
    alignSelf: 'center',
    marginVertical: 60,
    color: 'black',
    fontSize: 50,
  },
});

export {AlarmScreen};
