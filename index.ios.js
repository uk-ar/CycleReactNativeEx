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
const Rx = require('rx');

const { run } = require('@cycle/core');
//import {run} from '@cycle/rx-run';
import makeReactNativeDriver from '@cycle/react-native/src/driver';
//const { makeHTTPDriver } = require('@cycle/http');
const { makeFetchDriver } = require('@cycle/fetch');

const intent = require('./intent');
const model = require('./model');
const view = require('./view');

function main({ RN, HTTP, EE }) {
  const actions = intent(RN, HTTP);
  const { state$, request$ } = model(actions);
  // 0192521722
  // qwerty
  return {
    RN: state$.map(view),
    // App Transport Security
    /* HTTP: Rx.Observable
     *         .merge(actions.request$, request$), //state$.map(request),*/
    //HTTP: actions.request$
    //HTTP: request$
  };
}

run(main, {
  RN: makeReactNativeDriver('CycleReactNativeEx'),
  HTTP: makeFetchDriver(),
  //HTTP: makeHTTPDriver(),
});
