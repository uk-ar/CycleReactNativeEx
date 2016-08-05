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

//const { run } = require('@cycle/core');

import makeReactNativeDriver from '@cycle/react-native/src/driver';
import { makeHTTPDriver } from '@cycle/http';

//const { run } = require('@cycle/xstream-run');
import RxAdapter from '@cycle/rx-adapter';
import xsSA from '@cycle/xstream-adapter';
//const { makeFetchDriver } = require('@cycle/fetch');
import xs from 'xstream';

const HTTPDriver = makeHTTPDriver();

const intent = require('./intent');
const model = require('./model');
const view = require('./view');

import React from 'react';
import {
  Text,
  View,
} from 'react-native';

const RNDriver = makeReactNativeDriver('CycleReactNativeEx');

function main({ RN, HTTP, EE }) {
  const actions = intent(RN, HTTP);
  const { state$, request$ } = model(actions);
  // 0192521722
  // qwerty
  /* request$.map((r) => console.log("r:", r))
   *         .subscribe()*/
  /* RN.select('button').events('press')
   *   .map(ev => +1)
   *   .startWith(0)
   *   .scan((x,y) => x+y)*/
  return {
    /* RN: Rx.Observable
     * //.interval(100).take(1)
     *       .of(0)*/
    RN: RN.select('button').events('press')
          .map(ev => +1)
          .startWith(0)
          .do(i=>console.log("i:",i))
          .map(i =>
            <View>
              <Text selector="button">Increment</Text>
              <Text>You have clicked the button {i} times.</Text>
            </View>
          //),
          )//.shareReplay(10,1000),//size,ms

    //RN: state$.map(view),
    // App Transport Security
    /* HTTP: xs.of({
     *   //'http://localhost:8080/hello'
     *   url: "http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472", // GET method by default
     *   category: 'search',
     * })*/
    /* HTTP: Rx.Observable.of({
     *   //'http://localhost:8080/hello'
     *   url: "http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=Tokyo_Fuchu&format=json&isbn=9784828867472", // GET method by default
     *   category: 'search',
     * })*/
    /* HTTP: Rx.Observable
     *         .merge(actions.request$, request$), //state$.map(request),*/
     //HTTP: actions.request$
    //HTTP: request$
  };
}

//import {run} from '@cycle/rx-run';
import Cycle from '@cycle/rx-run';
const {sources, sinks, run} =
  Cycle(main,
        {RN: sink$ => {
          console.log("sink$", sink$);
          return RNDriver(sink$, RxAdapter);
        },
         //HTTP: makeFetchDriver(),
         //HTTP: sink$ => HTTPDriver(sink$, RxAdapter),
         //HTTP: sink$ => HTTPDriver(sink$, xsSA),
         HTTP: makeHTTPDriver()});
const dispose=run();
//dispose();

/* run(main, {
 *   //RN: makeReactNativeDriver('CycleReactNativeEx'),
 *   RN: sink$ => {
 *     console.log("sink$", sink$);
 *     return RNDriver(sink$, RxAdapter);
 *   },
 *   //HTTP: makeFetchDriver(),
 *   //HTTP: sink$ => HTTPDriver(sink$, RxAdapter),
 *   //HTTP: sink$ => HTTPDriver(sink$, xsSA),
 *   HTTP: makeHTTPDriver()
 * });*/
