/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  Modal,
  TouchableHighlight,
  View
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class diabetes extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
        glucose: ds.cloneWithRows(['row 1', 'row 2']),
        modalVis: false,
        text: '',
        q: [],
    };
  }

  setModalState(vis) {
    this.setState({modalVis: vis});
  }

  updateList(text) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    q = this.state.q;
    q.push(text);
    this.setState({q: q});
    this.setState({glucose: ds.cloneWithRows(this.state.q)});
    console.log(text);
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.glucose} renderRow={(rowData) => <Text>{rowData}</Text>} />
        <Modal visible={this.state.modalVis} onRequestClose={() => {}}>
            <View>
                <Text>Hello World!</Text>
                <TextInput onSubmitEditing={ (event) => this.updateList(event.nativeEvent.text) } />
                <TouchableHighlight onPress={ () => this.setModalState(false) }>
                    <Text>Close</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={ () => this.setModalState(false) }>
                    <Text>Done</Text>
                </TouchableHighlight>
            </View>
        </Modal>
        <ActionButton buttonColor="rgba(231, 76, 60, 1)">
            <ActionButton.Item buttonColor='#565656' title='Glucose' onPress={ () => this.setModalState(true) }>
                <Icon name="md-create" />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#565656' title='Insulin' onPress={ () => console.log('poop') }>
                <Icon name="md-create" />
            </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('diabetes', () => diabetes);
