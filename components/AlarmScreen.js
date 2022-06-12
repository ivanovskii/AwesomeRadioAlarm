import * as React from 'react';
import {Button, View} from 'react-native';

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

export {AlarmScreen};
