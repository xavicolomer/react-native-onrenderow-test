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
  View,
  ListView,
  TouchableHighlight
} from 'react-native';

import { v1 } from 'uuid'

class ListViewBug extends Component {
  constructor (props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([]),
      selectedItems: {},
      select: 'all',
      refreshList: false
    }
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.fetch())
    })
  }

  componentDidUpdate() {
    if (this.state.refreshList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.fetch()),
        refreshList: false
      })
    }
  }

  fetch() {
    let items = []

    for (let i = 0, len = 300; i < len; ++i) {
      if (this.state.select === 'all' || (this.state.select === 'red' && (i % 2 == 0))) {
        items.push({ name: 'Item ' + i, id: 'item-' + i, isRed: (i % 2 == 0) })
      }
    }

    return items
  }

  onPressOnItem(id) {
    let selectedItems = this.state.selectedItems;

    if (selectedItems[id]) {
      delete selectedItems[id]
    } else {
      selectedItems[id] = true
    }

    console.log(id, selectedItems)

    this.setState({
      selectedItems: selectedItems,
      dataSource: this.state.dataSource.cloneWithRows(this.fetch())
    })
  }

  onRenderRow (rowData) {
    let isSelected = false;

    if (this.state.selectedItems[rowData.id]) {
      isSelected = true;
    }

    console.log(isSelected);

    return <TouchableHighlight style={isSelected ? styles.cellSelected : styles.cell} onPress={() => this.onPressOnItem(rowData.id)}>
            <View>
              <View style={rowData.isRed ? styles.redDot : styles.grayDot}></View>
              <Text style={styles.cellText}>{rowData.name}</Text>
            </View>
          </TouchableHighlight>
  }

  selectRed() {
    console.log('red')
    this.setState({ select: 'red',
      dataSource: this.state.dataSource.cloneWithRows(this.fetch()),
      refreshList: true
    })
  }

  selectAll() {
    console.log('all')
    this.setState({
      select: 'all',
      dataSource: this.state.dataSource.cloneWithRows(this.fetch()),
      refreshList: true
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          select={this.state.select}
          enableEmptySections={true}
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.onRenderRow.bind(this)}
        />
        <View style={styles.bottom}>
          <TouchableHighlight style={styles.button} onPress={() => this.selectRed()}>
            <Text style={styles.buttonText}>Show Only Red</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.selectAll()}>
            <Text style={styles.buttonText}>Show All</Text>
          </TouchableHighlight>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  list: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    padding: 10
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
  cell: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00000033',
  },
  cellSelected: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00000033',
    backgroundColor: '#00ff00',
  },
  cellText: {
    width: 300,
  },
  bottom: {
    width: 380,
    flexDirection: 'row',
    position: 'absolute',
    height: 50,
    backgroundColor: '#00ff00',
    bottom: 0,
    left: 0
  },
  button: {
    flex: 0.5,
    height: 50,
    backgroundColor: '#eeeeee',
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: '#33333322',
  },
  redDot: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: '#ff0000',
  },
  grayDot: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: '#eeeeee',
  },
  buttonText: {
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('ListViewBug', () => ListViewBug);
