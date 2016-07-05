
import React from 'react';
const ReactNative = require('react-native');
let FAIcon = require('react-native-vector-icons/FontAwesome');

import materialColor from 'material-colors';
import { styles } from './styles';
import { itemsInfo } from './common';

const _ = require('lodash');

const {
  ActivityIndicator,
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  PixelRatio,
} = ReactNative;
import Touchable from '@cycle/react-native/src/Touchable';

const Dimensions = require('Dimensions');
const {
  width,
} = Dimensions.get('window');

let { SwipeableRow, SwipeableRow2 } = require('./SwipeableRow');

function LeftButton({ icon, text, style, backgroundColor, ...props }) {
  // backgroundColor are used from SwipeableButtons
  return (
    <View
      {...props}
      style={[style, {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, //vertical center
      }]}
    >
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10, marginRight: 5 }}
      />
      <Text>
        {text}
      </Text>
    </View>
  );
}

// http://mae.chab.in/archives/2854
// stateless component validation
function RightButton({ icon, text, style, backgroundColor, ...props }) {
  return (
    <View
      {...props}
      style={[style, {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, //vertical center
      }]}
    >
      <Text>
        {text}
      </Text>
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10, marginLeft: 5 }}
      />
    </View>
  );
}

let LibraryStatus = React.createClass({
  render() {
    const libraryStatus = this.props.libraryStatus || {};

    let text, name, backgroundColor;

    if (libraryStatus.rentable) {
      text = '貸出可';// 利用可
      style = { color: '#4CAF50' }; // Green
    } else if (libraryStatus.exist) {
      text = '貸出中';
      style = { color: '#FFC107' }; // amber
    } else if (libraryStatus.exist !== undefined) {
      text = 'なし';
      style = { color: '#F44336' }; // red
    } else {
      // text="取得中"
    }
    // http://www.google.com/design/spec/style/color.html#color-color-palette
    if (text) {
      return (
        <View style={[styles.row]}>
          <Text style={[
            // {fontSize: 14,},//default?
            style]}>
            {text}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.row]}>
          <Text>
            {'蔵書確認中'}
          </Text>
          <ActivityIndicator
            size="small"
          />
        </View>
      );
    }
  },
});

function getButtons(type, func, book) {
  let likedButton;
  let borrowedButton;
  let doneButton;
  const selfProps = { text: '先頭に移動', icon: 'level-up', close: false };
  // MIcon publish,vertical align top,low priority
  switch (type) {
    case '読みたい':
      likedButton = selfProps;
      break;
    case '借りてる':
      borrowedButton = selfProps;
      break;
    case '読んだ':
      doneButton = selfProps;
      break;
    default:
      break;
  }

  const leftButtons = [
    <LeftButton
      close={false}
      {...itemsInfo['読みたい']}
      {...likedButton}
      text={null}
      backgroundColor={materialColor.grey[300]}
      style={{ justifyContent: 'flex-end' }}
    />, // grey 300
    <LeftButton
      close
      onRelease={() => {
        console.log('like'); func(book, 'liked');
      }}
      {...itemsInfo['読みたい']}
      {...likedButton}
      style={{ width: width / 2 }}
    />, // light blue "#03A9F4"
    // blue "#2196F3"
    <LeftButton
      onRelease={() => func(book, 'borrowed')}
      close
      {...itemsInfo['借りてる']}
      {...borrowedButton}
      style={{ width }}
    />, //green
  ];

  const rightButtons = [
    <RightButton
      close={false}
      {...itemsInfo['読んだ']}
      {...doneButton}
      backgroundColor={materialColor.grey[300]}
      text={null}
    />, // grey 300
    <RightButton
      onRelease={() => func(book, 'done')}
      close
      {...itemsInfo['読んだ']}
      {...doneButton}
      style={{ justifyContent: 'flex-end' }}
    />, //amber
  ];// Touchable
  return { leftButtons, rightButtons };
}

// ToastAndroid.show('foo', ToastAndroid.SHORT)
const BookCell = React.createClass({
  render() {
    let { book, onRelease, style, title, ...props } = this.props;
    // There is 3 type of close behavior
    // animated left only
    // animated right and vertical close permanently
    // animated right and vertical close temporary
    // onSwipeEnd onSwipeStart
    // expand or close
    let { leftButtons, rightButtons } = getButtons(title, onRelease, book);
    // onPress={()=>console.log("cell press")}
    let TouchableElement = Touchable.TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = Touchable.TouchableNativeFeedback;
    }
    //console.log("hair:",StyleSheet.hairlineWidth,PixelRatio.roundToNearestPixel(StyleSheet.hairlineWidth),PixelRatio.get())

    return (
      //    style={{flex:1}}
      // style={{backgroundColor:"red"}}
      // style={{opacity:0.5}}
      <SwipeableRow2
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        onPanResponderMove={() => {
              // prevent vertical scroll
          this.props.onPanResponderMove &&
              this.props.onPanResponderMove();
        }}

        onPanResponderEnd={() => {
          this.props.onPanResponderEnd &&
              this.props.onPanResponderEnd();
        }}
      >
        <TouchableElement
          selector="cell"
          payload={book}
        >
          <View style={[styles.row, this.props.style]}>
            <Image source={{ uri: book.thumbnail }}
              resizeMode="contain"
              style={[styles.cellImage]}
            />
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
                <LibraryStatus libraryStatus={book.libraryStatus} />
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ height: StyleSheet.hairlineWidth,
                             backgroundColor: 'rgba(0, 0, 0, 0.1)',
                             marginRight: 10,
                             marginBottom: PixelRatio.get(),
                            //separator
                          }} />
            </View>
          </View>
        </TouchableElement>
      </SwipeableRow2>
    );
    // TODO:flex-start & flex-end
    return (
      // probrem with hard coded width
      <SwipeableRow
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        {...props}
      >
        <TouchableElement
          selector="cell"
          payload={book}
        >
          <View style={[styles.row, this.props.style]}>
            <Image source={{ uri: book.thumbnail }}
              resizeMode="contain"
              style={[styles.cellImage]}
            />
            <View style={[{ flexDirection: 'column' }]}>
              <View style={[{ padding: 10, justifyContent: 'center' },
                ]}>
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {book.author}
                </Text>
                <LibraryStatus libraryStatus={book.libraryStatus} />
              </View>
              <View style={{ height: StyleSheet.hairlineWidth,
                            backgroundColor: '#CCCCCC',
                            marginRight: 10,
                            //separator
                          }} />
            </View>
          </View>
        </TouchableElement>
      </SwipeableRow>
    );
  },
});

module.exports = { BookCell, SwipeableRow };
