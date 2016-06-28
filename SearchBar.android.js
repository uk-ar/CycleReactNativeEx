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

let { makeReactNativeDriver, generateCycleRender } = require('@cycle/react-native');
import Touchable from '@cycle/react-native/src/Touchable';

var IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

var SearchBar = React.createClass({
  render() {
    var loadingView;
    // FIXME:dynamic view and cycle view?
    if (this.props.isLoading) {
      loadingView = (
        <ProgressBarAndroid
          key="loadingView"
          styleAttr="Large"
          style={styles.spinner}
        />
      );
    } else {
      loadingView = (<View
        key="loadingView"
        style={styles.spinner}
      />);
    }

    var background = IS_RIPPLE_EFFECT_SUPPORTED ?
      TouchableNativeFeedback.SelectableBackgroundBorderless() :
      TouchableNativeFeedback.SelectableBackground();
    return (
      <View style={styles.searchBar} key="search">
        <TouchableNativeFeedback
          key="bar"
          background={background}
          onPress={() => this.refs.input && this.refs.input.focus()}
        >
          <View>
            <Image
              source={require('image!android_search_white')}
              style={styles.icon}
            />
          </View>
        </TouchableNativeFeedback>
        <Touchable.TextInput
          key="input"
          ref="input"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          onChange={this.props.onSearchChange}
          placeholder="Search a movie..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          selector="text-input"
        />
        {loadingView}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    height: 50,
    padding: 0,
    backgroundColor: 'transparent',
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
});

module.exports = SearchBar;
