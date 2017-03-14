import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookRow1,BookRow3} from '../../BookRow';

import {withDebug} from './common';
const BookRow1Debug = withDebug(BookRow1)

//import Perf from 'react-addons-perf';
var Perf = require('ReactPerf');

const {
  width:WIDTH,
} = Dimensions.get('window');

storiesOf('BookRow1', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with close props', () => (
    <BookRow1
      bucket="liked"
      onSwipeEnd={action('swipeEnd')}
      onSwipeStart={action('swipeStart')}>
      <Text>foo</Text>
    </BookRow1>
  ))
//not working
/* <BookRow1
    bucket="liked"
    style={{flexDirection:"row"}}
    >
  */
  .add('with width as props', () => (
    <BookRow1
      bucket="liked"
      style={{
        margin:10}}
      width={width-20}
    >
      <View
        style={{flexDirection:"row"}}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow1>
  ))
  .add('with width as style', () => (
    <BookRow1
      bucket="liked"
      style={{
        //width:width-20,
        backgroundColor:"red"
      }}
    >
      <View
        style={{flexDirection:"row"}}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow1>
  ))
//import PrefMonitor from 'react-native/Libraries/Performance/RCTRenderingPerf';

https://github.com/facebook/react-native/issues/11410
//Perf.start();
class PerfComp extends React.Component {
  perf(){
    console.log('start perf tracking');
    setTimeout(() => {
      console.log('stop perf tracking');
      Perf.stop();
      //Perf.printExclusive();
      const measurements = Perf.getLastMeasurements();
      console.log('stop perf tracking:',measurements);
      Perf.printInclusive(measurements);
      //Perf.printInclusive();
    }, 3000);
  }
  perfmon(){
    console.log('start perf tracking');
    PrefMonitor.toggle();
    PrefMonitor.start();
    setTimeout(() => {
      PrefMonitor.stop();
    },5000);
  }
  componentDidMount() {
    console.log('start perf tracking');
    setTimeout(() => {
      Perf.start();
      setTimeout(() => {
        Perf.stop();
        const measurements = Perf.getLastMeasurements();
        Perf.printInclusive(measurements);
        Perf.printExclusive(measurements);
        Perf.printWasted(measurements);
      }, 30000);
    }, 5000);
  }
  render() {
    return this.props.children;
  }
}

window.Perf = Perf;

storiesOf('BookRow3', module)
  .addDecorator(getStory => (
    <View style={{paddingTop:20}}>
      {getStory()}
    </View>
  ))
  .add('with width as style', () => (
    <View>
    <BookRow3
      bucket="liked"
      style={{
        //width:width-20,
        backgroundColor:"red"
      }}
    >
      <View
        style={{
          height:50,
          flexDirection:"row",
          backgroundColor:"white",
          //opacity:0.8,
          borderWidth:2,
          //backgroundColor:"transparent"
        }}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow3>
    <BookRow3
      bucket="liked"
      style={{
        //width:width-20,
        backgroundColor:"red"
      }}
    >
      <View
        style={{
          height:50,
          flexDirection:"row",
          backgroundColor:"white",
          //opacity:0.8,
          backgroundColor:"transparent"
        }}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow3>
    </View>
  ))
  .add('with 1 transparent children', () => (
    <PerfComp>
    <BookRow3
      bucket="liked"
      style={{
        //width:width-20,
        backgroundColor:"red"
      }}
    >
      <View
        style={{
          height:50,
          flexDirection:"row",
          backgroundColor:"white",
          //opacity:0.8,
          backgroundColor:"transparent"
        }}>
        <Text>foo</Text>
        <View
          style={{flex:1}}/>
        <Text>bar</Text>
      </View>
    </BookRow3>
    </PerfComp>
  ))
  .add('horizontal flex', () => (
    <ScrollView
      horizontal={true}
    >
      <View style={{
        //width:100,
        flex:1,
        height:20,
        backgroundColor:"red"
      }}/>
      <View style={{
        width:10,
        height:20,
        backgroundColor:"yellow"
      }}/>
      <View style={{
        width:30,
        height:20,
        backgroundColor:"green"
      }}/>
    </ScrollView>
  ))
  .add('horizontal flex', () => (
    <ScrollView
      horizontal={true}
    >
      <View style={{
        //width:100,
        flex:1,
        height:20,
        backgroundColor:"red"
      }}/>
      <View style={{
        width:10,
        height:20,
        backgroundColor:"yellow"
      }}/>
      <View style={{
        width:30,
        height:20,
        backgroundColor:"green"
      }}/>
    </ScrollView>
  ))
  .add('horizontal flex2', () => (
    <View style={{
      //width:WIDTH*2,
      height:20,
      backgroundColor:"red"
    }}>
      <View style={{
        backgroundColor:"yellow",
        position:"absolute",
        width:WIDTH,
        top:0,
        bottom:0,
        flexDirection:"row",
      }}>
        <Text>left</Text>
        <View style={{flex:1}}/>
        <Text>right</Text>
      </View>
      <ScrollView
        style={{
          width:WIDTH,
          backgroundColor:"transparent",
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={(comp)=>this.scroll=comp}
      >
        <View style={{
          width:WIDTH,
          backgroundColor:"transparent"
        }}/>
        <View style={{
          backgroundColor:"yellow"
        }}
          onLayout={({nativeEvent:{layout:{x, y, width, height}}}) => {
              this.scroll.scrollTo({x:WIDTH + width,animated:false})
            }}
        >
          <Text>left</Text>
        </View>
        <View style={{
          width:WIDTH,
          backgroundColor:"green"
        }}/>
        <View style={{
          backgroundColor:"yellow"
        }}>
          <Text>right</Text>
        </View>
        <View style={{
          width:WIDTH,
          backgroundColor:"transparent"
        }}/>
      </ScrollView>
    </View>
  ))
