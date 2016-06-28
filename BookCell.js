
import React, { Component } from 'react';
var ReactNative = require('react-native');
let { makeReactNativeDriver, generateCycleRender, CycleView } = require('@cycle/react-native');
var FAIcon = require('react-native-vector-icons/FontAwesome');
var MIcon = require('react-native-vector-icons/MaterialIcons');

import materialColor from 'material-colors';

var _ = require('lodash');

var {
  TouchableOpacity,
  ActivityIndicator,
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
  ToastAndroid,
} = ReactNative;
import Touchable from '@cycle/react-native/src/Touchable';

var Dimensions = require('Dimensions');
var {
  width,
  height,
} = Dimensions.get('window');

let { SwipeableRow, SwipeableRow2 } = require('./SwipeableRow');

function LeftButton({ icon, text, style, backgroundColor, ...props }) {
  return (
    <View
        {...props}
        style={[style, {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,//vertical center
          }]}>
      <FAIcon name={icon} size={20}
              style={{ margin: 10, marginRight: 5 }} />
      <Text>
        {text}
      </Text>
    </View>
  );
}

//http://mae.chab.in/archives/2854
//stateless component validation
function RightButton({ icon, text, style, backgroundColor, ...props }) {
  return (
    <View
        {...props}
        style={[style, {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,//vertical center
          }]}>
      <Text>
        {text}
      </Text>
      <FAIcon name={icon} size={20}
              style = {{ margin: 10, marginLeft: 5 }} />
    </View>
  );
}

var LibraryStatus = React.createClass({
  render: function () {
    var libraryStatus = this.props.libraryStatus || {};

    var text, name, backgroundColor;

    if (libraryStatus.rentable) {
      text = '貸出可';//利用可
      //style={backgroundColor: "#03A9F4"} //light blue
      //style={color: "#009688"} //Teal
      style = { color: '#4CAF50' }; //Green
    }else if (libraryStatus.exist) {
      text = '貸出中';
      //style={backgroundColor: "#FFC107"} //yellow
      //style={color: "#FFEB3B"} //yellow
      style = { color: '#FFC107' }; //amber
    }else if (libraryStatus.exist !== undefined) {
      text = 'なし';
      //style={backgroundColor: "#9E9E9E"} //grey
      style = { color: '#F44336' }; //red
    }else {
      //text="取得中"
    }
    //http://www.google.com/design/spec/style/color.html#color-color-palette
    if (text) {
      return (
        <View style={[styles.row]}
        >
          <Text style={[
            //{fontSize: 14,},//default?
            style]}>
            {text}
          </Text>
        </View>
      );
    }else {
      return (
        <View style={[styles.row]}>
          <Text>
            {'蔵書確認中'}
          </Text>
          <ActivityIndicator
              size="small"/>
        </View>
      );
    }
  },
});

function getButtons(type, func, book) {
  var leftButtons, rightButtons, likedButton,
      borrowedButton, doneButton;
  var selfProps = { text: '先頭に移動', icon: 'level-up', close: false };
  //MIcon publish,vertical align top,low priority
  switch (type){
    case '読みたい':
      likedButton = selfProps;
    break;
    case '借りてる':
      borrowedButton = selfProps;
    break;
    case '読んだ':
      doneButton = selfProps;
    break;
  }
  //#e0e0e0 #03a9f4 #4caf50
  var leftButtons = [
    <LeftButton
        icon="heart-o"
        close={false}
        backgroundColor={materialColor.grey[300]}
        style={{
          justifyContent: 'flex-end',
        }}
        {...likedButton}
        text={null}
    />,//grey 300
    <LeftButton
        icon="heart-o"
        close={true}
        onRelease = {() => {
    console.log('like');func(book, 'liked');
  }}

        backgroundColor={materialColor.lightBlue[500]}
        text="読みたい"
        style={{ width: width / 2 }}
        {...likedButton}
    />,//light blue "#03A9F4"
    //blue "#2196F3"
    <LeftButton
        onRelease={()=> func(book, 'borrowed')}
        close={true}
        backgroundColor={materialColor.green[500]}
        icon="bookmark-o"
        text="借りてる"
        style={{ width: width }}
        {...borrowedButton}
    />,//green
  ];
  var rightButtons = [
    <RightButton
        backgroundColor={materialColor.grey[300]}
        close={false}
        icon="check-square-o"
        {...doneButton}
        text={null}
     />,//grey 300
     <RightButton
         onRelease = {() => func(book, 'done')}
         backgroundColor={materialColor.amber[500]}
         close={true}
         icon="check-square-o"
         text="読んだ"
         style={{
          justifyContent: 'flex-end',
        }}
         {...doneButton}
     />,//amber
   ];//Touchable
  return { leftButtons, rightButtons };
}

//ToastAndroid.show('foo', ToastAndroid.SHORT)
var BookCell = React.createClass({
  render: function () {
    var { book, onRelease, style, title, ...props } = this.props;
    //There is 3 type of close behavior
    //animated left only
    //animated right and vertical close permanently
    //animated right and vertical close temporary
    //onSwipeEnd onSwipeStart
    //expand or close
    var { leftButtons, rightButtons } = getButtons(title, onRelease, book);
    //onPress={()=>console.log("cell press")}
    var TouchableElement = Touchable.TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = Touchable.TouchableNativeFeedback;
    }

    return (
      //    style={{flex:1}}
      //style={{backgroundColor:"red"}}
      //style={{opacity:0.5}}
      <SwipeableRow2
          leftButtons={leftButtons}
          rightButtons={rightButtons}
          onPanResponderMove={()=> {
              //prevent vertical scroll
              this.props.onPanResponderMove &&
              this.props.onPanResponderMove();
            }}

          onPanResponderEnd={()=> {
              this.props.onPanResponderEnd &&
              this.props.onPanResponderEnd();
            }}
      >
        <TouchableElement
            selector="cell"
            payload={book}>
          <View style={[styles.row, this.props.style]}>
            <Image source={{ uri: book.thumbnail }}
                   resizeMode="contain"
                   style={[styles.cellImage]} />
            <View style={[{ flexDirection: 'column',
                          flex: 1,
                          //backgroundColor:"red",
                        }]}>
              <View style={[{ padding: 10, justifyContent: 'center' },
                ]}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {book.author}
                </Text>
                <LibraryStatus libraryStatus={book.libraryStatus}/>
              </View>
              <View style={{ flex: 1 }}/>
              <View style={{ height: StyleSheet.hairlineWidth,
                            backgroundColor: '#CCCCCC',
                            marginRight: 10,
                            //separator
                          }}
              />
            </View>
          </View>
        </TouchableElement>
      </SwipeableRow2>
    );
    //TODO:flex-start & flex-end
    return (
      //probrem with hard coded width
      <SwipeableRow
          leftButtons={leftButtons}
          rightButtons={rightButtons}
          {...props}>
        <TouchableElement
            selector="cell"
        payload={book}>
          <View style={[styles.row, this.props.style]}>
            <Image source={{ uri: book.thumbnail }}
                   resizeMode="contain"
                   style={[styles.cellImage]} />
            <View style={[{ flexDirection: 'column' }]}>
              <View style={[{ padding: 10, justifyContent: 'center' },
                ]}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {book.author}
                </Text>
                <LibraryStatus libraryStatus={book.libraryStatus}/>
              </View>
              <View style={{ height: StyleSheet.hairlineWidth,
                            backgroundColor: '#CCCCCC',
                            marginRight: 10,
                            //separator
                          }}
              />
            </View>
          </View>
        </TouchableElement>
      </SwipeableRow>
    );
  },
});
var cellWidth = 64;
//https://www.google.com/design/spec/style/color.html#color-color-palette
var styles = StyleSheet.create({
  //application & lib
  rowCenter: {
    flexDirection: 'row',
    //justifyContent:"center",
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  //for new swipe
  /* container: {
     flex: 1,
     flexDirection: 'column'
     },
     outerScroll: {
     flex: 1,
     flexDirection: 'column'
     },
     row: {
     flex: 1
     }, */
  container: {
    flex: 1,
    //backgroundColor: 'white',
  },
  //for cell
  row: {
    //alignItems: 'center',
    //backgroundColor: 'white',
    flexDirection: 'row',
    //padding: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  bookAuthor: {
    //color: '#999999',
    color: '#9E9E9E',//grey
    fontSize: 12,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 64,//PixelRatio 2
    margin: 10,
    width: cellWidth,
  },
  cellBorder: {
    //backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  segmented: {
    flex: 1,
    //backgroundColor: 'black',
  },
  icon: {
    //width: 50
  },
  toolbarButton: {
    //width: 50,            //Step 2
    //textAlign:'center',
    flex: 1,                //Step 3
  },
  toolbarTitle: {
    //alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,                //Step 3
  },
  separator: {
    height: 1,
    //backgroundColor: '#CCCCCC',
  },
  test: {
    borderWidth: 2,
    borderColor: 'red',
  },
  Text: {
    color: '#FFFFFF',
    //width:30,
    //textAlignVertical:"bottom",//not working?
    //textAlign:'center',//ok
    //biblio
    //padding:5,//expand width for flex
    //margin:5,//actual space for flex
    //textAlign:"center",
  },
});

module.exports = { BookCell, SwipeableRow };
