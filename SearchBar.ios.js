'use strict';

import React, { Component } from 'react';
import {
  TouchableOpacity,
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  LayoutAnimation,
  // cell
  PixelRatio,
  // searchBar
  TextInput,
  ToolbarAndroid,
  Navigator,
  NavigatorIOS,
  Animated,
  ScrollView,
  PanResponder,
} from 'react-native';

let { makeReactNativeDriver, generateCycleRender, CycleView } = require('@cycle/react-native');

var SearchBar = React.createClass({
  render() {
    // there is a search for ios
    // https://github.com/umhan35/react-native-search-bar
    // TODO:Add Icon
    return (
      <CycleView style={styles.searchBar} key="search">
        <Image
          source={require('image!android_search_white')}
          style={styles.icon}
        />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChange={this.props.onSearchChange}
          placeholder="Search a movie..."
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          selector="text-input"
        />
        <ActivityIndicatorIOS
          animating={this.props.isLoading}
          style={styles.spinner}
        />
      </CycleView>
    );
  },
});

var styles = StyleSheet.create({
  searchBar: {
    // mergin for status bar?
    // statusBarFrame.size.height
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
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
});

module.exports = SearchBar;
