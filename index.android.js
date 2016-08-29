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
import { run } from '@cycle/rx-run';

import makeReactNativeDriver from '@cycle/react-native/src/driver';
import { makeHTTPDriver } from '@cycle/http';

import RxAdapter from '@cycle/rx-adapter';
// const { makeFetchDriver } = require('@cycle/fetch');

const HTTPDriver = makeHTTPDriver();

const intent = require('./intent');
const model = require('./model');
const view = require('./view');

const RNDriver = makeReactNativeDriver('CycleReactNativeEx');
import Rx from 'rx';

function main({ RN, HTTP, EE }) {
  const actions = intent(RN, HTTP);
  const state$ = model(actions);
  // const request$ = Rx.Observable.merge(actions.requestBooks$, actions.requestStatus$);
  // 0192521722
  // qwerty
  actions.request$.map((r) => console.log('request:', r))
         .subscribe();
  return {
    RN: state$.map(view),
    // App Transport Security
    /* HTTP: Rx.Observable.of({
     *   url: "http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472", // GET method by default
     *   category: 'searchedBooksStatus',
     * })*/
    /* HTTP: Rx.Observable
     *         .merge(actions.request$, request$), //state$.map(request),*/
    // HTTP: actions.request$
    HTTP: actions.request$
  };
}

run(main, {
  // RN: makeReactNativeDriver('CycleReactNativeEx'),
  RN: sink$ => RNDriver(sink$, RxAdapter),
  HTTP: makeHTTPDriver()
});
