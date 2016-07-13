/**
 * Sample React Native App
 * https://github.com/facebook/react-native
TODO:
   - fix swipeout
     - enable swipe out
     - fix performance
   - automate webview
   - support books pagination
   - add done state
   - add sort feature
 */
const { run } = require('@cycle/core');
import makeReactNativeDriver from '@cycle/react-native/src/driver';
const { makeHTTPDriver } = require('@cycle/http');

import Touchable from '@cycle/react-native/src/Touchable';
import {
  UIManager,
} from 'react-native';

import styles from './styles';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const intent = require('./intent');
const model = require('./model');
const view = require('./view');

function main({ RN, HTTP, EE }) {
  const actions = intent(RN, HTTP);
  const {state$,request$} = model(actions);
  // 0192521722
  // qwerty
  return {
    RN: state$.map(view),
    HTTP: actions.request$, //state$.map(request),
  };
}

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeHTTPDriver(),
});
