
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

function BookCell({ book, style, onPress, ...props }) {
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
          source={{ uri: book.thumbnail || undefined
            /* Image source cannot accept null */ }}
          resizeMode="contain"
          style={[styles.cellImage]}
        />
        <View
          style={[{ flexDirection: 'column',
          flex: 1,
                        //backgroundColor:"red",
        }]}
        >
          <View
            style={[{ padding: 10, justifyContent: 'center' },
          ]}
          >
            <View style={{ flexDirection: 'row' }}>
              { book.bucket ?
                <FAIcon
                  name={itemsInfo[book.bucket].icon} size={20}
                  style={{ marginRight: 5,
                    color: itemsInfo[book.bucket].backgroundColor }}
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
          <View
style={{ height: StyleSheet.hairlineWidth,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginRight: 10,
            marginBottom: PixelRatio.get(),
                         //separator
          }}
          />
        </View>
      </View>
    </TouchableElement>
  );
}

module.exports = { LibraryStatus, BookCell };
