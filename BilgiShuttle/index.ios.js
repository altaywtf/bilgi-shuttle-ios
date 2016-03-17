'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  NavigatorIOS,
  View
} from 'react-native';

import List from './App/List';

class BilgiShuttle extends Component {
  render() {
    return (
      <NavigatorIOS
        barTintColor='#D50000'
        titleTextColor='white'
        tintColor='#fff'
        style={styles.container}
        initialRoute={{
          title: 'Bilgi Shuttle',
          component: List,
          backButtonTitle: 'Back',
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

AppRegistry.registerComponent('BilgiShuttle', () => BilgiShuttle);
