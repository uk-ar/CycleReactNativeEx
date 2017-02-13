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
  TouchableOpacity,
  TouchableHighlight,
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
    <TouchableElement
      onPress={() => onCloseSection(section)}
    >
      <Icon
        name="close"
        selector="close"
        size={20}
        style={{ margin:5, marginRight: 5}}
      />
    </TouchableElement>
  ) : (
      <Icon
        name={itemsInfo[section].icon}
        color={itemsInfo[section].backgroundColor}
        size={20}
        style={{ margin:5, marginRight: 5 }}
      />
  );

  const content = (section === 'search' && close) ? (
    <View
      style={styles.sectionHeader}
      key={section}>
      {icon}
      <TextInput
        autoFocus={true}
        selector="text-input"
        onChangeText={onChangeQuery}
        style={styles.searchBarInput}
      />
      { loadingState ? (
          <ActivityIndicator
            animating
            color="white"
            size="large"
            style={styles.spinner}
          />) : null
      }
    </View>
  ) : (
    <View
      style={styles.iconAndText}
      key={section}>
      {icon}
      <Text>
        {itemsInfo[section].text}
      </Text>
    </View>
  );

  return (
    <View
      style={styles.sectionHeader}
    >
      {close ?
       content : (
         /* FIXME: workaround for
            https://github.com/facebook/react-native/issues/11834 */
         <TouchableElement
           underlayColor="rgb(210, 230, 255)"
           onPress={() => onSelectSection(section)}
           key={section}
         >
           {content}
         </TouchableElement>)
      }
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
      underlayColor="rgb(210, 230, 255)"
      onPress={() => onSelectSection()}
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
