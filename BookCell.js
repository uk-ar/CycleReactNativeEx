
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {
  ActivityIndicator,
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';

import { styles } from './styles';
import { itemsInfo } from './common';

function TextWithIndicator({ children }) {
  return (
    <View style={[styles.row]}>
      <Text>
        {children}
      </Text>
      <ActivityIndicator
        size="small"
        style={{ marginLeft: 5 }}
      />
    </View>
  );
}

// const LibraryStatusWithLoading = withLoading(LibraryStatus)
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
    // {!text && ActivityIndicator}
    return (
      <TextWithIndicator>
        蔵書確認中
      </TextWithIndicator>
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

function genTempThumbnail(isbn) {
  return `http://www.hanmoto.com/bd/img/${isbn}.jpg`;
}

function BookCell({ book, ...props }) {
  return (<BookCell1 book={book} {...props} />)
  /* return (
   *   book.title ?
   *     <BookCell1 book={book} {...props} /> :
   *     <BookCell1 book={book} {...props}>
   *       <TextWithIndicator>
   *       タイトル確認中
   *     </TextWithIndicator>
   *     </BookCell1>);*/
}

function BookCell1({ book, style, onPress, children, ...props }) {
  const TouchableElement = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableHighlight;
  return (
    <TouchableElement
      onPress={onPress}
    >
      <View
        {...props}
        style={[style, styles.row]}
      >
        <Image
          source={{ uri: book.thumbnail ||
                         genTempThumbnail(book.isbn) || undefined
          /* Image source cannot accept null */ }}
          resizeMode="contain"
          style={
            styles.cellImage            // left
                }
        />
        <View
          style={[{
            flexDirection: 'column',
            flex: 1,
            margin: 10,
            marginBottom: 0,
              //justifyContent: 'center'
              //right
              //backgroundColor:"red",
          }]}
        >
          <View
            style={{
              flex: 1,
            //flexDirection: 'row',
            //right hight
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
              style={{
              // flex: 1,
                flexDirection: 'row',
              }}
            >
              { book.bucket ?
                <FAIcon
                  name={itemsInfo[book.bucket].icon} size={20}
                  style={{
                    // marginRight: 5,
                    letterSpacing: 5,
                    color: itemsInfo[book.bucket].backgroundColor }}
                /> : null }
              <Text
                style={styles.bookTitle}
                numberOfLines={1}
              >
                {book.title}
              </Text>
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.author}
            </Text>
            {children}
          </View>
          <View
            style={{
              // right low
              height: StyleSheet.hairlineWidth,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              //separator
            }}
          />
        </View>
      </View>
    </TouchableElement>
  );
}

module.exports = { LibraryStatus, BookCell, TextWithIndicator };
