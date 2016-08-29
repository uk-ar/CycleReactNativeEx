
import React from 'react';
const ReactNative = require('react-native');
const FAIcon = require('react-native-vector-icons/FontAwesome');

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

const { SwipeableRow, SwipeableRow2 } = require('./SwipeableRow');

function LeftButton({ icon, text, style, backgroundColor, ...props }) {
  //console.log("props:",icon, text, style, backgroundColor, props)
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

function LibraryStatus({ libraryStatus = {}, ...props }) {
  let text;
  let style;

  if (libraryStatus.rentable) {
    text = '貸出可';// 利用可
    style = { color: '#4CAF50' }; // Green
  } else if (libraryStatus.exist) {
    text = '貸出中';
    style = { color: '#FFC107' }; // amber
  } else if (libraryStatus.exist !== undefined) {
    text = '蔵書なし';
    style = { color: '#F44336' }; // red
  } else {
    // text="取得中"
  }
  // http://www.google.com/design/spec/style/color.html#color-color-palette
  if (!text) {
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
  return (
    <View style={[styles.row]}>
      <Text style={style}>
        {text}
      </Text>
    </View>
  );
}

function getButtons(bucket, isbn) {
  let likedButton;
  let borrowedButton;
  let doneButton;
  const selfProps = { text: '先頭に移動', icon: 'level-up', close: false };
  // MIcon publish,vertical align top,low priority
  switch (bucket) {
    case 'liked':
      likedButton = selfProps;
      break;
    case 'borrowed':
      borrowedButton = selfProps;
      break;
    case 'done':
      doneButton = selfProps;
      break;
    default:
      break;
  }

  const leftButtons = [
    <LeftButton
      close={false}
      {...itemsInfo['liked']}
      {...likedButton}
      text={null}
      backgroundColor={materialColor.grey[300]}
      style={{ justifyContent: 'flex-end' }}
    />, // grey 300
    <LeftButton
      close
      onRelease={() => {
        console.log('like'); func(isbn, 'liked');
      }}
      {...itemsInfo['liked']}
      {...likedButton}
      style={{ width: width / 2 }}
    />, // light blue "#03A9F4"
    // blue "#2196F3"
    <LeftButton
      onRelease={() => func(isbn, 'borrowed')}
      close
      {...itemsInfo['borrowed']}
      {...borrowedButton}
      style={{ width }}
    />, //green
  ];

  const rightButtons = [
    <RightButton
      close={false}
      {...itemsInfo['done']}
      {...doneButton}
      backgroundColor={materialColor.grey[300]}
      text={null}
    />, // grey 300
    <RightButton
      onRelease={() => func(isbn, 'done')}
      close
      {...itemsInfo['done']}
      {...doneButton}
      style={{ justifyContent: 'flex-end' }}
    />, //amber
  ];// Touchable
  return { leftButtons, rightButtons };
}

/* SwipeableRow2
 *   onPanResponderMove, onPanResponderEnd,
 *   onRelease,
 *   bucket,
 * children
 *   book
 *   ...props
 *   style*/
// ToastAndroid.show('foo', ToastAndroid.SHORT)

function BookCell({ book, ...props }) {
  let TouchableElement = Touchable.TouchableHighlight;
  if (Platform.OS === 'android') {
    TouchableElement = Touchable.TouchableNativeFeedback;
     // BUG:TouchableNativeFeedback TouchableOpacity TouchableWithoutFeedback not support style
  }

  return (
     <View {...props}>
    <TouchableElement
      selector="cell"
      payload={book}
    >
    <View style={styles.row}>
          <Image
            source={{ uri: book.thumbnail || undefined
              /* Image source cannot accpet null */ }}
            resizeMode="contain"
            style={[styles.cellImage]}
          />
          <View style={[{ flexDirection: 'column',
                          flex: 1,
                          //backgroundColor:"red",
            }]}>
            <View style={[{ padding: 10, justifyContent: 'center' },
              ]}>
              <View style={{ flexDirection: 'row'}}>
                { book.bucket ?
                 <FAIcon
                   name={itemsInfo[book.bucket].icon} size={20}
                   style={{ marginRight: 5 ,
                            color: itemsInfo[book.bucket].backgroundColor}}
                 /> : null }
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
              </View>
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
    </View>);
}

function BookRow({ bucket, book, onRelease, style }) {
  // There is 3 type of close behavior
  // animated left only
  // animated right and vertical close permanently
  // animated right and vertical close temporary
  // onSwipeEnd onSwipeStart
  // expand or close
  // skip close behavior
  // (book,bucket)=>closeanimate.start(onRelease)
  // onRelease is cycle:touchable element
  const { leftButtons, rightButtons } = getButtons(bucket, book);
  return (
    // CloseableCompo
    // need ref & React.cloneElement?
    <SwipeableRow2
      onRelease={() => onRelease(book, bucket)}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      onPanResponderMove={() => {
          // prevent vertical scroll
          // onPanResponderMove && onPanResponderMove();
      }}
      onPanResponderEnd={() => {
          // onPanResponderEnd && onPanResponderEnd();
      }}
    >
      <BookCell
        book={book}
        style={style}
      />
    </SwipeableRow2>
  );
}

module.exports = { BookRow };
// module.exports = { BookCell, SwipeableRow };
