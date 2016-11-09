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
// const FAIcon = require('react-native-vector-icons/FontAwesome');
import Icon from 'react-native-vector-icons/FontAwesome';
import { emptyFunction } from 'fbjs/lib/emptyFunction';

import { styles } from './styles';
import { itemsInfo, TouchableElement } from './common';

/* function SearchHeader({ close, loadingState, ...props }) {
 *   // console.log('search',   loadingState);
 *   return (!close ? (
 *     <ItemsHeader
 *       {...props}
 *       section="search"
 *     >
 *       <TextInput
 *         autoCapitalize="none"
 *         autoCorrect={false}
 *         selector="text-input"
 *         style={styles.searchBarInput}
 *       />
 *       {loadingState ?
 *        <ActivityIndicator
 *          animating
 *          color="white"
 *          size="large"
 *          style={styles.spinner}
 *        /> : null}
 *     </ItemsHeader>
 *   ) : (
 *     <ItemsHeader
 *       {...props}
 *       style={[styles.sectionHeader]}
 *       section="search"
 *     />)
 *   );
 * }*/

function ItemsHeader({
  onCloseSection, onSelectSection, onChangeQuery,
  close, payload, section, loadingState, children, style
}) {
  if (!itemsInfo[section]) { return null; }
  // const icon = (selectedSection === null) ? (
  const icon = close ? (
    <Icon
      onPress={() => onCloseSection(section)}
      name="close"
      selector="close"
      size={20}
      style={{ marginRight: 5 }}
    />) : (
    <Icon
      name={itemsInfo[section].icon}
      color={itemsInfo[section].backgroundColor}
      size={20}
      style={{ marginRight: 5 }}
    />);

  const content = (section === 'search' && close) ? (
    <TextInput
      autoFocus={true}
      selector="text-input"
      onChangeText={onChangeQuery}
      style={styles.searchBarInput}
    />
  ) : (
  <Text>
    {itemsInfo[section].text}
  </Text>
  );

  const indicator = (section === 'search' && close && loadingState) ? (
    <ActivityIndicator
      animating
      color="white"
      size="large"
      style={styles.spinner}
    />) : null;

  return (
    <View style={style}>
      <TouchableElement
        onPress={() => onSelectSection(section)}
        key={section}
      >
        <View style={styles.sectionHeader}>
          {icon}
          {content}
          {indicator}
        </View>
      </TouchableElement>
    </View>
  );
}

ItemsHeader.propTypes = {
  onCloseSection: React.PropTypes.func,
  onSelectSection: React.PropTypes.func,
  onChangeQuery: React.PropTypes.func,
  //close, payload, section, loadingState
};
ItemsHeader.defaultProps = {
  onCloseSection: emptyFunction,
  onSelectSection: emptyFunction,
  onChangeQuery: emptyFunction,
  //close, payload, section, loadingState
};

function ItemsFooter({ count, onSelectSection }) {
  return (
    <TouchableElement
      onPress={() => onSelectSection(section)}
    >
      <View style={styles.sectionFooter}>
        <Text>
          {`すべて表示(${count})`}
        </Text>
      </View>
    </TouchableElement>
  );
}

ItemsFooter.propTypes = {
  count: React.PropTypes.number,
  onSelectSection: React.PropTypes.func,
  //close, payload, section, loadingState
};
ItemsFooter.defaultProps = {
  onSelectSection: emptyFunction,
  //close, payload, section, loadingState
};

module.exports = { ItemsHeader, ItemsFooter };
