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
import Touchable from '@cycle/react-native/src/Touchable';

Touchable.TouchableElement = Touchable.TouchableHighlight;
if (Platform.OS === 'android') {
  Touchable.TouchableElement = Touchable.TouchableNativeFeedback;
  // TouchableElement = TouchableNativeFeedback;
}

Touchable.TextInput = Touchable.createCycleComponent(
  TextInput);

Touchable.FAIcon = Touchable.createCycleComponent(
  FAIcon, Touchable.PRESS_ACTION_TYPES);

class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { toggle: true ,opacity: 0 };
    this.state = { toggle: true };
  }
  componentDidMount() {
    // this.setState({ opacity: 1 })
  }
  render() {
    console.log('render header pad?', this.state.toggle);
    //            close={this.state.toggle}
    //            close={true}
    //            close={!this.state.toggle}
    //          close={!this.state.toggle}
    return (
      <Stylish.View
        style={{ padding: 10, opacity: this.state.opacity }}
        anim={{ duration: 500 }}
      >
        <CloseableView
          style={{ justifyContent: 'center',
                   backgroundColor: 'red' }}
          direction="vertical"
          close
          ref="close"
        >
          <Stylish.View
            ref="view1"
            style={{
              // height:this.state.toggle ? 10 : 20,
              // height:10,
              // backgroundColor: this.state.toggle ? 'black' : 'white',
            }}
          >
            <Text>foo</Text>
          </Stylish.View>
        </CloseableView>

        <Stylish.View
          ref="view2"
          style={{
            height: 10,
            backgroundColor: 'green',
          }}
        />
        <View
          ref="view5"
          style={{
            height: 20,
            width: 20,
            backgroundColor: 'gray',
          }}
        >
          <View
            ref="view4"
            style={{
              height: 40,
              width: 40,
              backgroundColor: 'yellow',
              //transform: this.state.toggle ? [{scale:3}] : [{scale:2},{scale:3}],
            }}
          />
        </View>
        <Text
          style={{ color: 'white' }}
          onPress={() => {
            this.refs.view2.animate(
              {
                height: 10,
                backgroundColor: 'black',
              },
              {
                height: 10,
                backgroundColor: 'orange',
              },);
          }}
        >
          {'animate'}
        </Text>
        <View style={{
          backgroundColor: 'purple' }}>
          <Text
            style={{ color: 'white' }}
            onPress={() => {
              console.log('refs', this.refs);
              this.refs.view4.measure((x, y, width, height) =>
                  console.log('view4:', width, height));
              this.refs.view5.measure((x, y, width, height) =>
                  console.log('view5:', width, height));
              this.setState((prev, current) => ({ toggle: !prev.toggle }));
              this.refs.close.toggle()
                    .then(() =>
                      console.log('toggled')
                      // ToastAndroid.show('Toggled', ToastAndroid.SHORT)
                    );
                // FIXME:why width is shurinked?
            }}
          >
            {'toggle'}
          </Text>
        </View>
      </Stylish.View>);
  }
}

function SearchHeader({ loadingState, close, ...props }) {
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
    //       style={[styles.sectionFooter, styles.sectionHeader]}
  );
}

import { itemsInfo } from './common';
function ItemsHeader({ payload, section, children, style, close }) {
  if (!itemsInfo[section]) { return null; }
  // const icon = (selectedSection === null) ? (
  const icon = !close ? (
    <FAIcon
      name={itemsInfo[section].icon}
      color={itemsInfo[section].backgroundColor}
      size={20}
      style={{ marginRight: 5 }}
    />) : (
      <Touchable.FAIcon
        name="close"
        selector="close"
        payload="contentOffset.y"
        size={20}
        style={{ marginRight: 5 }}
      />);
  const content = children || (
    <Text>
      {itemsInfo[section].text}
    </Text>
  );
  return (
    <Touchable.TouchableElement
      selector="section"
      key={section}
      payload={payload}
    >
      <View style={style || styles.sectionHeader}>
        {icon}
        {content}
      </View>
    </Touchable.TouchableElement>
  );
}

module.exports = { Header, ItemsHeader, SearchHeader };
