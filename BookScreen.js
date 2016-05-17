
import React, { Component } from 'react';
let {makeReactNativeDriver, generateCycleRender, CycleView} = require('@cycle/react-native');
var Icon = require('react-native-vector-icons/FontAwesome');
var GiftedSpinner = require('react-native-gifted-spinner');
var Emoji = require('react-native-emoji');

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

//rx js output confusing message when component not imported

var BookScreen = React.createClass({
  /* render: function(){
     generateCycleRender(this.myRender)
     }, */
  render: function() {
    return(
      <CycleView style={{flex: 1}}>
        <ToolbarAndroid
            actions={[]}
            navIcon={require('image!ic_arrow_back_white_24dp')}
            style={styles.toolbar}
            titleColor="white"
            selector = "back"
            //title={route.movie.title}
            //title = "book"
        />
        <WebView url = {this.props.url}
                 domStorageEnabled={true}
                 startInLoadingState={true}
                 javaScriptEnabled={true}
                 style={styles.WebViewContainer}
        />
      </CycleView>
    )
      //TODO:navigationBar
      //https://github.com/facebook/react-native/blob/cd89016ee7168bb6971f800779e0878e9a70206f/Examples/UIExplorer/Navigator/NavigationBarSample.js
      /* 'document.querySelector("[value$=\'カートに入れる\']").click()'
         injectedJavaScript='document.querySelector(".button").click()'
         onError = {i => console.log("on err:%O", i)}
         onLoad = {i => console.log("on load:%O", i)}
         onLoadEnd = {i => console.log("on load end:%O", i)}
         onLoadStart = {i => console.log("on load start:%O", i)}
         onNavigationStateChange = {i => console.log("on nav:%O", i)}
       */
  }
});

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  WebViewContainer: {
    flex: 1,
  }
});

module.exports = BookScreen;
