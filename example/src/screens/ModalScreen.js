import React, {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

// important imports, the magic is here
import { Navigation, Screen } from 'react-native-navigation';

// need to import every screen we push
import './PushedScreen';
import './StyledScreen';

// instead of React.Component, we extend Screen (imported above)
class ModalScreen extends Screen {
  static navigatorButtons = {
    leftButtons: [{
      title: 'Close',
      id: 'close'
    }]
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex: 1, padding: 20}}>

        <TouchableOpacity onPress={ this.onPushPress.bind(this) }>
          <Text style={styles.button}>Push Plain Screen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ this.onPushStyledPress.bind(this) }>
          <Text style={styles.button}>Push Styled Screen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ this.onClosePress.bind(this) }>
          <Text style={styles.button}>Close Modal</Text>
        </TouchableOpacity>

      </View>
    );
  }
  onNavigatorEvent(event) {
    if (event.id == 'close') {
      this.navigator.dismissModal();
    }
  }
  onPushPress() {
    this.navigator.push({
      title: "More",
      screen: "example.PushedScreen"
    });
  }
  onPushStyledPress() {
    this.navigator.push({
      title: "More",
      screen: "example.StyledScreen"
    });
  }
  onClosePress() {
    this.navigator.dismissModal();
  }
}

const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop:10,
    color: 'blue'
  }
});

// every screen must be registered with a unique name
Navigation.registerScreen('example.ModalScreen', () => ModalScreen);
