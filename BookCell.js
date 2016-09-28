
import React from 'react';
const ReactNative = require('react-native');
const FAIcon = require('react-native-vector-icons/FontAwesome');

import materialColor from 'material-colors';
import { styles } from './styles';
import { itemsInfo } from './common';

const _ = require('lodash');

const {
  ActivityIndicator,
  Text,
  View,
  Image,
  Animated,
  Platform,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableNativeFeedback,
} = ReactNative;
// jest bug
import Touchable from '@cycle/react-native/src/Touchable';
// const Touchable = require('@cycle/react-native/src/Touchable');
// const Touchable = require('@cycle/react-native/lib/Touchable');
// import Touchable from '@cycle/react-native/lib/Touchable';

const Dimensions = require('Dimensions');
const {
  width,
} = Dimensions.get('window');

const { SwipeableRow2, SwipeableButtons2 } = require('./SwipeableRow');

function LeftButton({ icon, text, style, backgroundColor, ...props }) {
  // console.log("props:",icon, text, style, backgroundColor, props)
  // backgroundColor are used from SwipeableButtons
  return (
    <View
      {...props}
      style={[style, {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, //vertical center
      }]}
    >
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10, marginRight: 5 }}
      />
      <Text>
        {text}
      </Text>
    </View>
  );
}

// http://mae.chab.in/archives/2854
// stateless component validation
// flexDirection=row-reverse
function RightButton({ icon, text, style, backgroundColor, ...props }) {
  return (
    <View
      {...props}
      style={[style, {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, //vertical center
      }]}
    >
      <Text>
        {text}
      </Text>
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10, marginLeft: 5 }}
      />
    </View>
  );
}

// const LibraryStatusWithLoading = withLoading(LibraryStatus)
function LibraryStatus({ libraryStatus = {}, ...props }) {
  let text;
  let style;

  if (libraryStatus.rentable) {
    text = '貸出可';// 利用可
    style = { color: '#4CAF50' }; // Green
  } else if (libraryStatus.exist) {
    text = '貸出中';
    style = { color: '#FFC107' }; // amber
  } else if (libraryStatus.exist !== undefined) {
    text = '蔵書なし';
    style = { color: '#F44336' }; // red
  } else {
    // text="取得中"
  }
  // http://www.google.com/design/spec/style/color.html#color-color-palette
  if (!text) {
    // {!text && ActivityIndicator}
    return (
      <View style={[styles.row]}>
        <Text>
          {'蔵書確認中'}
        </Text>
        <ActivityIndicator
          size="small"
        />
      </View>
    );
  }
  return (
    <View style={[styles.row]}>
      <Text style={style}>
        {text}
      </Text>
    </View>
  );
}

function getButtons(bucket, isbn) {
  let likedButton;
  let borrowedButton;
  let doneButton;
  const selfProps = { text: '先頭に移動', icon: 'level-up', close: false };
  // MIcon publish,vertical align top,low priority
  switch (bucket) {
    case 'liked':
      likedButton = selfProps;
      break;
    case 'borrowed':
      borrowedButton = selfProps;
      break;
    case 'done':
      doneButton = selfProps;
      break;
    default:
      break;
  }

  const leftButtons = [
    <LeftButton
      close={false}
      {...itemsInfo.liked}
      {...likedButton}
      text={null}
      backgroundColor={materialColor.grey[300]}
      style={{ justifyContent: 'flex-end' }}
    />, // grey 300
    <LeftButton
      close
      target="liked"
      onRelease={() => {
        console.log('like'); func(isbn, 'liked');
      }}
      {...itemsInfo.liked}
      {...likedButton}
      style={{ width: width / 2 }}
    />, // light blue "#03A9F4"
    // blue "#2196F3"
    <LeftButton
      onRelease={() => func(isbn, 'borrowed')}
      close
      target="borrowed"
      {...itemsInfo.borrowed}
      {...borrowedButton}
      style={{ width }}
    />, //green
  ];

  const rightButtons = [
    <RightButton
      close={false}
      {...itemsInfo.done}
      {...doneButton}
      backgroundColor={materialColor.grey[300]}
      text={null}
    />, // grey 300
    <RightButton
      onRelease={() => func(isbn, 'done')}
      close
      target="done"
      {...itemsInfo.done}
      {...doneButton}
      style={{ justifyContent: 'flex-end' }}
    />, //amber
  ];// Touchable
  return { leftButtons, rightButtons };
}
//bucket,target->icon,text,backgroundColor,close,target
function Action({ icon,text,backgroundColor,close,target, style,...props }) {
  //console.log("props:",icon, text, style, backgroundColor, props)
  // backgroundColor,close,target are used from SwipeableActions
  return (
    <View
      {...props}
      style={[{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1, //vertical center
          //backgroundColor:backgroundColor,//for debug
        },style]}
    >
      <FAIcon
        name={icon} size={20}
        style={{ margin: 10 }}
      />
      <View style={{margin: -2.5 }} />
      <Text>
        {text}
      </Text>
    </View>
  );
}

//bucket,target->icon,text,backgroundColor,close,target
 function genActions(self) {
   function getProps(self,target){
     ({icon,text,backgroundColor} = itemsInfo[target])
     if(target === self){
       ({icon,text} = { text: '先頭に移動', icon: 'level-up'})
     }
     return {icon,text,backgroundColor,close:true,target}
   }
   const nop = {
     text:null,backgroundColor:materialColor.grey[300],close:false,target:null}
   const leftActions = [
     <Action
       {...getProps(self,"liked")}
       {...nop}
       style={{ justifyContent: 'flex-end' }}
     />,
     <Action
       {...getProps(self,"liked")}
       style={{ width: width / 2 }}
     />,
     <Action
       {...getProps(self,"borrowed")}
       style={{ width }}
     />,
   ];
   const rightActions = [
     <Action
       {...getProps(self,"done")}
       {...nop}
       style={{ flexDirection: 'row-reverse',
                justifyContent: 'flex-end'}}
     />,
     <Action
       {...getProps(self,"done")}
       style={{ flexDirection: 'row-reverse'}}
     />,
   ];// Touchable
   return { leftActions, rightActions };
 }

/* SwipeableRow2
 *   onPanResponderMove, onPanResponderEnd,
 *   onRelease,
 *   bucket,
 * children
 *   book
 *   ...props
 *   style*/
// ToastAndroid.show('foo', ToastAndroid.SHORT)

function BookCell({ book,style,onPress, ...props }) {
  let TouchableElement = TouchableHighlight;
  // (Platform.OS === 'android') &&
  if (Platform.OS === 'android') {
    TouchableElement = TouchableNativeFeedback;
     // BUG:TouchableNativeFeedback TouchableOpacity TouchableWithoutFeedback not support style
  }

  return (
    <TouchableElement
      onPress={onPress}
    >
      <View
        {...props}
        style={[style,styles.row]}>
        <Image
          source={{ uri: book.thumbnail || undefined
            /* Image source cannot accpet null */ }}
          resizeMode="contain"
          style={[styles.cellImage]}
        />
        <View style={[{ flexDirection: 'column',
                        flex: 1,
                        //backgroundColor:"red",
          }]}>
          <View style={[{ padding: 10, justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row' }}>
              { book.bucket ?
                <FAIcon
                  name={itemsInfo[book.bucket].icon} size={20}
                  style={{ marginRight: 5,
                           color: itemsInfo[book.bucket].backgroundColor }}
                /> : null }
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
            </View>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {book.author}
            </Text>
            <LibraryStatus libraryStatus={book.libraryStatus} />
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ height: StyleSheet.hairlineWidth,
                         backgroundColor: 'rgba(0, 0, 0, 0.1)',
                         marginRight: 10,
                         marginBottom: PixelRatio.get(),
                         //separator
          }} />
        </View>
      </View>
    </TouchableElement>
  );
}
import { Closeable, Closeable2 } from './Closeable';
import { AnimView } from './AnimView';
// function BookRow({ bucket, book, onRelease, style }) {
class BookRow0 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      close: true,
      bounceValue: new Animated.Value(0),
      props:{style:{height:0.1},
             anim: {delay:5000}}
    };
  }
  componentDidMount() {
    //console.log('didmount', this, this.props.book);
        //this.state.bounceValue.setValue(1.5);     // Start large
    Animated.timing(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 1,                         // Animate to smaller size
        duration: 5000,                          // Bouncier spring
                                              }
    ).start();
    /* this.refs.outer.open().then(
     *   this.setState({close:false})
     * )*/
    console.log("th:",this)
    //this.onMount(()=>console.log("onMount"))
    /* this.setState(
     *   {props:{style:{height:80},
     *           anim: {delay:2000}}})*/
    //this.anim.animateTo({height:80})
    //console.log("ta:",this.anim)
    //this.setState({close:!this.state.close})
  }
  // class style because of ref to leftActions
  close() {
    console.log('close');
    return new Promise(resolve =>
      setTimeout(() => {
        console.log('promise done');
        resolve('resolve');
      }, 5000)
    );
  }
  render() {
    const { bucket, book, onRelease, style } = this.props;
  // There is 3 type of close behavior
  // animated left only
  // animated right and vertical close permanently
  // animated right and vertical close temporary
  // onSwipeEnd onSwipeStart
  // expand or close
  // skip close behavior
  // (book,bucket)=>closeanimate.start(onRelease)
  // onRelease is cycle:touchable element
    const { leftButtons, rightButtons } = getButtons(bucket, book);
    return (
    // CloseableCompo
    // need ref & React.cloneElement?
    // onSwipeStart responder move
    // onSwipeEnd responder end
      // onOpen responder end(not closed)
      /* style={{
         opacity:this.state.bounceValue,
         height: this.state.close ? 50 : 80
         }}
         onLayout={c=>console.log('lay', this, this.props.book)}
         {...this.state.props}
         {c => {
         this.anim = c;
         console.log("this.anim:",this.anim)
         //this.anim.animateTo({height:80})
         }}
         <Closeable2
         direction="vertical"
         style={{ overflow: 'hidden'}}
         close={false}
         ref="outer"
         >
      */
      <TouchableHighlight
        onPress={()=>{
            console.log(this)
            this.refs.anim.animateTo({height:80})
            //this.setState({close:!this.state.close})
            console.log("mypress")}}
      >
        <AnimView
          ref={c => {
              console.log('ref:', this, this.props.book);
              this.anim = c}}
          style={{
            opacity:this.state.bounceValue,
            height: this.state.close ? 50 : 80
          }}
      >
        <SwipeableRow2
          ref={
            //c=>console.log('ref:', this, this.props.book)
            null
              }
      onSwipeStart={() => console.log('start')}
      onSwipeEnd={() => console.log('end')}
      onOpen={() => console.log('open')}
      onRelease={(positiveSwipe) => {
          // this.refs.leftButtons.state
        console.log('zzz',
                      this.leftActions.state.index,
                      this.leftActions.getTarget());
          /* this.refs.leftButtons.release().then(()=>
          this.props.onRelease())
          */
          // console.log("zzz",this.leftActions.state.index)
        if (positiveSwipe) {
          this.leftActions.release().then(() =>
              onRelease(book, this.leftActions.getTarget(), this)
            );
        }
      }}
      renderLeftActions={width =>
        <SwipeableButtons2
          ref={c => this.leftActions = c}
          direction="left"
          width={width}
          buttons={leftButtons}
        />}
      rightButtons={rightButtons}
    >
      <BookCell
        book={book}
        style={style}
      />
    </SwipeableRow2>
      </AnimView>
      </TouchableHighlight>
    );//
  }
}

class BookRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: new Animated.Value(null),
    };
  }
  componentDidMount() {
    console.log("th:",this)
    //this.anim.animate({height:0.1},{height:80})
    //this.state.height.setValue(0.1)
    /* Animated.timing(this.state.height,{
     *   ToValue:100,
     *   duration:5000,
     *   delay:5000,
     * }
     * ).start(() => console.log("fin:"));*/
  }
  render() {
    console.log("rend?")
    const { bucket, book, onRelease, style } = this.props;
    const { leftButtons, rightButtons } = getButtons(bucket, book);
    return (
      //        style={{height:this.state.height}}
      <Animated.View
      >
        {/* <AnimView
        ref={c => {
        //console.log('ref:', this, this.props.book);
        this.anim = c;
        //this.anim.animateTo({height:80})
        }}
        style={{
        opacity:this.state.bounceValue,
        //height: this.state.close ? 50 : 80
        height: 40
        }}
        > */}
        <SwipeableRow2
          ref={
            //c=>console.log('ref:', this, this.props.book)
            null
              }
          onSwipeStart={() => console.log('start')}
          onSwipeEnd={() => console.log('end')}
          onOpen={() => console.log('open')}
          onRelease={(positiveSwipe) => {
              // this.refs.leftButtons.state
              console.log('zzz',
                          this.leftActions.state.index,
                          this.leftActions.getTarget());
              /* this.refs.leftButtons.release().then(()=>
                 this.props.onRelease())
               */
              // console.log("zzz",this.leftActions.state.index)
              if (positiveSwipe) {
                this.leftActions.release().then(() =>
                  onRelease(book, this.leftActions.getTarget(), this)
                );
              }
            }}
          renderLeftActions={width =>
            <SwipeableButtons2
          ref={c => this.leftActions = c}
          direction="left"
          width={width}
          buttons={leftButtons}
                  />}
          rightButtons={rightButtons}
        >
          <BookCell
            book={book}
            style={style}
          />
      </SwipeableRow2>
      {/* </AnimView> */}
      </Animated.View>
    );//
  }
}

module.exports = { BookRow, LibraryStatus, BookCell,Action, genActions};
// module.exports = { BookCell, SwipeableRow };
