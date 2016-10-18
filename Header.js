import React from 'react';
import {
  Platform,
  Text,
  View,
  NavigationExperimental,
  TextInput,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  // TouchableHighlight,
  // TouchableNativeFeedback
} from 'react-native';
const FAIcon = require('react-native-vector-icons/FontAwesome');

import { styles } from './styles';
import { Stylish } from './Stylish';
import { CloseableView } from './Closeable';
//import Touchable from '@cycle/react-native/src/Touchable';

function SearchHeader({ close, loadingState, ...props }) {
  // console.log('search',   loadingState);
  return (!close ? (
    <ItemsHeader
      {...props}
      section="search"
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        selector="text-input"
        style={styles.searchBarInput}
      />
      {loadingState ?
       <ActivityIndicator
         animating
         color="white"
         size="large"
         style={styles.spinner}
       /> : null}
    </ItemsHeader>
  ) : (
    <ItemsHeader
      {...props}
      style={[styles.sectionHeader]}
      section="search"
    />)
  );
}

import { itemsInfo, TouchableElement } from './common';
function ItemsHeader({ close, payload, section, loadingState, children, style }) {
  if (!itemsInfo[section]) { return null; }
  // const icon = (selectedSection === null) ? (
  const icon = close ? (
    <FAIcon
      name="close"
      selector="close"
      size={20}
      style={{ marginRight: 5 }}
    />) : (
    <FAIcon
      name={itemsInfo[section].icon}
      color={itemsInfo[section].backgroundColor}
      size={20}
      style={{ marginRight: 5 }}
    />);

  const content = (section === "search" && close) ? (
    //        autoFocus={true}
    <View>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        selector="text-input"
        style={styles.searchBarInput}
      />
      { loadingState ?
        <ActivityIndicator
          animating
          color="white"
          size="large"
          style={styles.spinner}
        /> : null }
    </View>
     ):(
     <Text>
       {itemsInfo[section].text}
     </Text>
     );

  return (
    <TouchableElement
      selector="section"
      key={section}
      payload={payload}
    >
      <View style={style || styles.sectionHeader}>
        {icon}
        {content}
      </View>
    </TouchableElement>
  );
}

function ItemsFooter({ payload, count }) {
  return (
    <TouchableElement
      selector="section"
      payload={payload}
    >
      <View style={styles.sectionFooter}>
        <Text>
          {`すべて表示(${count})`}
        </Text>
      </View>
    </TouchableElement>
  );
}

module.exports = { ItemsHeader, ItemsFooter };
