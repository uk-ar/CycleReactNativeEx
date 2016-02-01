'use strict';

var React = require('react-native');
var {
  ActivityIndicatorIOS,
  TextInput,
  StyleSheet,
  View,
} = React;

let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');

var SearchBar = React.createClass({
  render: function() {
    return (
      <CycleView style = {styles.searchBar} key = "search">
        <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChange={this.props.onSearchChange}
            placeholder="Search a movie..."
            onFocus={this.props.onFocus}
            style={styles.searchBarInput}
            selector = "text-input"
        />
        <ActivityIndicatorIOS
            animating={this.props.isLoading}
            style={styles.spinner}
        />
      </CycleView>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    marginTop: 64,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  spinner: {
    width: 30,
  },
});

module.exports = SearchBar;
