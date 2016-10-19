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
  DatePickerAndroid,
  TimePickerAndroid,
  View
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import SQLite from 'react-native-sqlite-storage';

export default class diabetes extends Component {
  constructor() {
    super();
    this.state = {
        glucose: undefined,
        modalVis: false,
        text: '',
        glucoseLevels: [],
        db: null,
        done: false,
        currentDate: new Date().toLocaleDateString(),
        currentTime: this.getTime(),
    };
  }

  getTime() {
      var d = new Date();
      return this._formatTime(d.getHours(), d.getMinutes());
  }

  _formatTime(hour, minute) {
      return hour + ':' + (minute < 10 ? '0' + minute : minute);
  }

  datePicker = async () => {
      try {
          const {action, year, month, day} = await DatePickerAndroid.open();
          if (action !== DatePickerAndroid.dismissedAction) {
              var date = new Date(year, month, day);
              this.setState({
                  currentDate: date.toLocaleDateString(),
              });
          }
          console.log(this.state);
      } catch ({code, message}) {
          console.warn(`Error in example: `, message);
      }
  };

  timePicker = async () => {
      try {
          const {action, minute, hour} = await TimePickerAndroid.open();
          if (action === TimePickerAndroid.timeSetAction) {
              this.setState({
                  currentTime: this._formatTime(hour, minute),
              });
          }
          console.log(this.state);
      } catch ({code, message}) {
          console.warn(`Error in example: `, message);
      }
  };

  componentDidMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var values = [];

    let db = SQLite.openDatabase("test.db", "1.0", "Test database", 200000, this.q3, this.q1);
    db.transaction((tx) => {
        tx.executeSql('create table glucose(id integer primary key, value integer)', [], (tx, results) => {
            console.log("created table");
        });
    });

    db.transaction((tx) => {
        tx.executeSql('select value from glucose', [], (tx, results) => {
            console.log("selecting...");
            let rows = results.rows.raw();
            console.log(rows);
            rows.map(row => {
                var glucoseLevels = this.state.glucoseLevels.slice();
                glucoseLevels.push(row.value);
                this.setState({glucoseLevels:glucoseLevels,});
            });
            this.setState({
                glucose: ds.cloneWithRows(this.state.glucoseLevels),
                done: true,
            });
        });
    });

    console.log(values);

    this.setState({
        db: db,
    });
  }

  q1(err) {
    console.log("SQL ERROR: " + err);
  }

  q2() {
    console.log("SQL executed fine");
  }

  q3() {
    console.log("db opened");
  }

  setModalState(vis) {
    this.setState({modalVis: vis});
  }

  updateText(text) {
    this.setState({text: text});
  }

  addItemToDB(text) {
    this.state.db.transaction((tx) => {
      tx.executeSql('insert into glucose(value) values(?)', [text], (tx, results) => {
        console.log("inserted");
        console.log(results);
      });
    });
  }

  updateList() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    glucoseLevels = this.state.glucoseLevels;
    glucoseLevels.push(this.state.text);
    this.addItemToDB(this.state.text);
    this.setState({
        glucoseLevels: glucoseLevels,
        glucose: ds.cloneWithRows(this.state.glucoseLevels),
    });
    this.setModalState(false);
  }

  render() {
    if(this.state.done === true) {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.glucose} renderRow={(rowData) => <Text>{rowData}</Text>} />
        <Modal visible={this.state.modalVis} onRequestClose={() => {}}>
            <View>
                <TouchableHighlight onPress={this.datePicker.bind(this)}>
                    <Text style={styles.text}>{this.state.currentDate}</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.timePicker.bind(this)}>
                    <Text style={styles.text}>{this.state.currentTime}</Text>
                </TouchableHighlight>
                <Text>Hello World!</Text>
                <TextInput onChange={ (event) => this.updateText(event.nativeEvent.text) } keyboardType='numeric' />
                <TouchableHighlight onPress={ () => this.setModalState(false) }>
                    <Text>Close</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={ () => this.updateList() }>
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
    } else {
        return (<View style={styles.container}><Text>Not ready</Text></View>);
    }
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
