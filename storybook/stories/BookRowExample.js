import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  Dimensions,
  InteractionManager,
  StyleSheet,
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
    //https://github.com/facebook/react-native/issues/11410#issuecomment-267785635
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
  .add('panResponder & useNativeDriver', () => {
    this.panX = new Animated.Value(0);
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      /* onPanResponderMove: Animated.event(
       *   [null, {dx: this.panX}],
       *   //{useNativeDriver: true}//error
       * ),*/
      //onPanResponderGrant: e => console.log(e),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
    //this.panX.addListener(v=>console.log(v))
    /* onResponderMove={Animated.event(
     *   [null, {dx: this.panX}],
     *   //{ useNativeDriver: true}//error
     * )}*/
    return(
      <Animated.View
        {...this._panResponder.panHandlers}
        style={{
          flexDirection:"row",
          transform: [{
            translateX: this.panX
          }]
        }}
      >
        <View style={{
          //width:100,
          position:"absolute",
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
      </Animated.View>
    )
    }
  )
  .add('scrollView & useNativeDriver', () => {
    //Simple scrollView can drop fps...
    this.panX = new Animated.Value(0);
    this.panX.addListener(v=>console.log(v.value))
    //c.scrollTo({x:10,animated:false})
    //console.log(c._component.scrollTo({x:-100,animated:false}))
    return(
      <View>
      <Animated.View style={{
        position:"absolute",
        width:WIDTH,
        top:0,
        bottom:0,
        flexDirection:"row",
        /* backgroundColor:this.panX.interpolate({
         *   inputRange:[-WIDTH,WIDTH],
         *   outputRange:["red","blue"]
         * })*/
        //"yellow",
        /*  */
      }}>
        <Text>left</Text>
        <View style={{flex:1}}/>
        <Text>right</Text>
      </Animated.View>
      <Animated.ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      ref={comp=>this.scroll=comp._component}
      style={{opacity:0}}
      onMomentumScrollBegin={()=>console.log("disabled?")}
      onLayout={()=>{
        console.log("onlay")
        this.panX.setOffset(-WIDTH)
        this.scroll.scrollTo({x:WIDTH,animated:false})
        InteractionManager.runAfterInteractions(()=>
          this.scroll.setNativeProps({style:{opacity:1}}))
        //need animation
        //setTimeout(()=>)
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: this.panX } } }],
        { useNativeDriver: true }//error
      )}
      >
      <View style={{
        width:WIDTH,
        height:20,
        //backgroundColor:"red"
      }}/>
      <Animated.View style={{
        //width:30,
        width:WIDTH,
        height:20,
        backgroundColor:"green",
      }}/>
      <View style={{
        width:WIDTH,
        height:20,
        //backgroundColor:"yellow"
      }}>
      </View>
      </Animated.ScrollView>
      </View>
    )
  })
  .add('scrollView & useNativeDriver 2', () => {
    //Simple scrollView can drop fps...
    this.panX = new Animated.Value(0);
    this.panX.addListener(v=>console.log(v.value))
    //c.scrollTo({x:10,animated:false})
    //console.log(c._component.scrollTo({x:-100,animated:false}))
    return(
      <View>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            //opacity:0.3,
            flexDirection:"row",
            backgroundColor:"yellow",
          }}>
          {/* background action */}
          <Text>left</Text>
          <View style={{flex:1}}/>
          <Text>right</Text>
        </View>
        <Animated.View
          style={{
          //...StyleSheet.absoluteFillObject,
          //width:30,
            width:WIDTH*3,
            opacity:0.3,
            flexDirection:"row",
          transform: [{
            translateX: Animated.multiply(-1,this.panX),
          }]
          }}>
          <View
            style={{
              //...StyleSheet.absoluteFillObject,
              //width:30,
              width:WIDTH,
              height:20,
              backgroundColor:"black",
            }}
          />
          <View
            style={{
              //...StyleSheet.absoluteFillObject,
              //width:30,
              width:WIDTH,
              height:20,
              backgroundColor:"green",
            }}
          />
          <View
            style={{
              //...StyleSheet.absoluteFillObject,
              //width:30,
              width:WIDTH,
              height:20,
              backgroundColor:"orange",
            }}
          />
        </Animated.View>
        <Animated.ScrollView
          style={{
            ...StyleSheet.absoluteFillObject,
            //backgroundColor:"red",
            opacity:0
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ref={comp=>this.scroll=comp._component}
          onMomentumScrollBegin={()=>console.log("disabled?")}
          onLayout={()=>{
              console.log("onlay")
              this.panX.setOffset(-WIDTH)
              this.scroll.scrollTo({x:WIDTH,animated:false})
              InteractionManager.runAfterInteractions(()=>
                this.scroll.setNativeProps({style:{opacity:1}}))
              //need animation
              //setTimeout(()=>)
            }}
          onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.panX } } }],
              { useNativeDriver: true }//error
            )}
        >
          <View style={{
            width:WIDTH*3,
            //height:20,
          }}/>
        </Animated.ScrollView>
      </View>
    )
  })
