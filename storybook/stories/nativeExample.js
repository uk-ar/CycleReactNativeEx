import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ScrollView,
  ListView,
  Linking,
  Modal,
  NavigationExperimental,
  Button,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import ReactTransitionGroup from 'react-addons-transition-group';
import Stylish from 'react-native-stylish';

import CenterView from './CenterView';
import Welcome from './Welcome';
import {BookCell} from '../../BookCell';
import {SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
import {withDebug,VerticalCenterView,TestListView,debugView} from './common'

const RAKUTEN_ISBN_API =
  'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&applicationId=1088506385229803383&formatVersion=2&isbnjan=';

class ScrollPositionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggle: true };
  }
  render() {
    return (
      <ScrollView
        ref={c => this.scrollview = c}
        removeClippedSubview={false}
        onContentSizeChange={
          (contentWidth, contentHeight) => {
            // this.scrollview.scrollTo({x:0,y:-1,animated:true});
            // console.log(contentHeight,this.scrollview);
            // this.scrollview.forceUpdate()
          }}
        contentContainerStyle={{
          // flex:1,
          justifyContent: 'center'
        }}
      >
        <View style={{ height: this.state.toggle ? null : 0.1, overflow: 'hidden' }}>
          <Text style={{ fontSize: 96 }}>Scroll me plz</Text>

          <TouchableHighlight onPress={() => console.log('press:')}>
            <Text style={{ fontSize: 96 }}>If you like</Text>
          </TouchableHighlight>
          <Text style={{ fontSize: 96 }}>Scrolling down</Text>
          <Text style={{ fontSize: 96 }}>What's the best</Text>
          <Text style={{ fontSize: 96 }}>Framework around?</Text>
          <Text style={{ fontSize: 80 }}>React Native</Text>
        </View>
        <TouchableHighlight onPress={() => {
            this.setState({ toggle: !this.state.toggle }, () => {
              this.scrollview.scrollTo({ x: 0, y: 0, animated: true });
            });
            // console.log("press:",this.state.toggle)
          }}>
          <Text style={{ fontSize: 96, color: 'red' }}>If you like</Text>
        </TouchableHighlight>
        <Text style={{ fontSize: 96 }}>wn</Text>
        <Text style={{ fontSize: 96 }}>est</Text>
        <Text style={{ fontSize: 96 }}>ound?</Text>
        <Text style={{ fontSize: 80 }}>2</Text>
        <Text style={{ fontSize: 96 }}>wn</Text>
        <Text style={{ fontSize: 96 }}>est</Text>
        <Text style={{ fontSize: 96 }}>ound?</Text>
        <Text style={{ fontSize: 80 }}>2</Text>

      </ScrollView>
    );
  }
}

storiesOf('Scroll View', module)
  .add('contentContainerStyle', () => (
    //contentContainerStyle=
    <ScrollView
      style={{borderWidth:10,borderColor:"red"}/*out*/}
      contentContainerStyle={{borderWidth:10,borderColor:"green"}/*in*/}
    >
      <Text style={{fontSize:96}}>Scroll me plzaaaaaaaaaaaaaaaaaaaa</Text>
    </ScrollView>
  ))
  .add('scroll position', () => (
    <ScrollPositionView
    />
  ))

class NestedView extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    //this.props.data.length
    return (
      <View
        ref={c=>this.out=c}
        style={{
          width:50,height:50,
          backgroundColor:"red",

          overflow:"hidden",
        }}>
        <View
          ref={c=>this.in=c}
          style={{
            width:100,height:100,
            backgroundColor:"green",

            position:"absolute"
          }}>
        </View>
      </View>
    )
  }
}

class LifeCycleView extends React.Component {
  constructor(props) {
    super(props);
    action("constructor1")()
    this.state = {
      layouted: false,
      fadeAnim: new Animated.Value(0.1),
      style:{
        opacity: 0,
        height: 0.1,
        transform:[{scale: 0.1}],//BUG:when scale 0
      }
    };
  }
  componentWillMount() {
    action("componentWillMount2")()
  }
  animate(){
    //console.log("ro",this.root)
    this.root.measure(
      (x, y, width, height) => {
        this.setState({
          style: {
            /* opacity: this.state.fadeAnim,
             * transform:[{
             *   scale: this.state.fadeAnim
             * }],*/
            height: this.state.fadeAnim.interpolate({
              inputRange:[0,1],
              outputRange:[0.1,height]
            }),
            //backgroundColor:"red",
          }})
        Animated.timing(
          this.state.fadeAnim, {
            toValue: 1,
            duration: 3000
          }
        ).start();
      }
    )
  }
  componentDidMount() {
    action("componentDidMount4")()
  }
  render(){
    //this.props.data.length
    return (
      <View>
        <Animated.View
          ref={()=>action("ref3")()}
          onLayout={()=>{
              if(!this.state.layouted){
                action("onFirstLayout5")()
                this.animate()
                this.setState({layouted:true})
              }
            }}
          style={this.state.style}
        >
          <View
            ref={c => this.root = c}
            style={{
              position:this.state.layouted ? "relative" :
                       "absolute",//to measure
              }}>
            {this.props.children}
          </View>
        </Animated.View>
        <View
          style={{
            alignSelf:"center",
            height:50,
            width:200,
            backgroundColor:"yellow"}} />
      </View>
    )
  }
}

class LifeCycleView2 extends React.Component {
  constructor(props) {
    super(props);
    action("constructor1")()
    this.state = {
      layouted: false,
    };
  }
  componentWillAppear(callback){
    action("componentWillAppear")()
    callback()
  }
  componentDidAppear(){
    action("componentDidAppear")()
  }
  componentWillEnter(callback){
    action("componentWillEnter")()
    callback()
  }
  componentDidEnter(){
    action("componentDidEnter")()
  }
  componentWillLeave(callback){
    action("componentWillLeave")()
    callback()
  }
  componentDidLeave(){
    action("componentDidLeave")()
  }
  componentWillMount() {
    action("componentWillMount2")()
  }
  componentDidMount() {
    action("componentDidMount4")()
  }
  render(){
    //this.props.data.length
    return (
      <View
        ref={()=>action("ref3")()}
        onLayout={()=>{
            if(!this.state.layouted){
              action("onFirstLayout5")()
              this.setState({layouted:true})
            }
          }}
      >
        {this.props.children}
      </View>
    )
  }
}

const NestedViewDebug = withDebug(NestedView)

storiesOf('View', module)
  .add('nested ', () => (
    <NestedViewDebug data={[{foo:"bar"}]}
      onPress={(props,self)=>{
          self.in.measure((x,y,width,height)=>{
            console.log("in",x,y,width,height)
          })
          self.out.measure((x,y,width,height)=>{
            console.log("out",x,y,width,height)
          })
          //console.log("baz",self)
        }}
    />
  ))
  .add('lifecycle ', () => (
    <LifeCycleView>
      <View
        style={{
          width:100,height:100,
          backgroundColor:"green"}}/>
    </LifeCycleView>
  ))
  .add('lifecycle2 ', () => (
    <ReactTransitionGroup component={View}>
      <LifeCycleView2>
        <View
          style={{
            width:100,height:100,
            backgroundColor:"green"}}/>
      </LifeCycleView2>
      <LifeCycleView2>
        <View
          style={{
            width:100,height:100,
            backgroundColor:"green"}}/>
      </LifeCycleView2>
    </ReactTransitionGroup>
  ))
  .add('lifecycle2 inside listview', () => (
    <TestListView>
      {(dataSource)=>
        <ListView
          style={{paddingTop:20,flex:1}}
          dataSource={dataSource}
          renderScrollComponent={({children, ...props}) =>{
              //<ScrollView {...props}>
              console.log("c",children,props)
              return (
              <ScrollView {...props}>
                <ReactTransitionGroup {...children} component={View}/>
              </ScrollView>)
            }}
          renderRow={(rowData,rowID,sectionID) =>
            <LifeCycleView2>
              {debugView("row")(rowData,rowID,sectionID)}
            </LifeCycleView2>
                    }
        />
      }
    </TestListView>
  ))

class LinkingView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    let url = Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
      }else{
        console.log('no url');
      }
    }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  _handleOpenURL(event) {
    console.log("shareotu",event.url);
  }
  render(){
    //this.props.data.length
    return (
        <View
          ref={c=>this.in=c}
          style={{
            width:100,height:100,
            backgroundColor:"green",
          }}>
          <Text onPress={()=>{
              Linking.openURL("http://www.google.co.jp").catch(err => console.error('An error occurred', err));
            }}>
            press to open url
          </Text>
      </View>
    )
  }
}

storiesOf('Linking', module)
  .add('view ', () => (
    <LinkingView/>
  ))

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state={visible:false}
  }
  render(){
    //this.props.data.length
    return (
      <View
        style={{
          //flex:1,
          paddingTop:20,
        }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visible}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              flex:1,
              justifyContent:"center",
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding:5,
                margin:10,
                borderRadius:5,
              }}
            >
          <Text>
            Modal
          </Text>
            </View>
          </View>
        </Modal>
        <Text
          onPress={()=>{
              this.setState({visible:true});
            }}>
          Open
        </Text>
      </View>
    )
  }
}

class BooksFromURL extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isbns: null,
      dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }
  //https://gist.github.com/uk-ar/7574cb6d06dfa848780f508073492d86
  componentDidMount(){
    fetch(this.props.url)
      .then(response => response.text())
      .then(text => {
        let isbns = text.match(/\b978\d{10}\b/g)
        this.setState({
          isbns: isbns
        })
        return isbns
      })
      .then(isbns =>
        isbns.map(isbn =>
          fetch('http://www.hanmoto.com/api/book.php?ISBN='+isbn)
          //fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn)
          //fetch(RAKUTEN_ISBN_API+isbn)
          .then(response => response.json())
          .then(body =>{
            console.log(body)
            //let { title, author, isbn, largeImageUrl } = body.Items[0]
            let { title, authors, largeImageUrl } =
              body.items[0].volumeInfo
            console.log("t",{
              title: title.replace(/^【バーゲン本】/, ''),
              author: authors[0],
              isbn,
              thumbnail: largeImageUrl,
            });
          })
        )
      )
  }
  render(){
    const { url, ...props } = this.props
    console.log("render",this.state.isbns)
    if(this.state.isbns === null){
      return(
        <ActivityIndicator
          size="large"
          style={{
            //alignItems:'center',
            //justifyContent:'center',
            flex:1,
            height:80}}
        />)
    }
    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(this.state.isbns)}
        renderRow={(rowData) =>
          <BookCell book={{isbn:rowData}}/>
                  }
      />)
  }
}

class ModalExample2 extends React.Component {
  constructor(props) {
    super(props);
    this.state={visible:false}
  }
  render(){
    //this.props.data.length
    console.log("he",NavigationExperimental.Header.HEIGHT,)
    return (
      <View
        style={{
          //flex:1,
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
        >
          <View
            style={{
              //
              flex:1,
              //justifyContent:"center",
              backgroundColor: '#EBEBF1',
            }}
          >
            <View
              style={{
                height:NavigationExperimental.Header.HEIGHT,
                paddingTop:Platform.OS === 'ios' ? 20 : 0,
                backgroundColor: "#f7f7f8",//copy
                borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
                justifyContent:"center",
                flexDirection:"row",
              }}>
              <Button
                onPress={()=>null}
                title="Cancel"
              />
              <NavigationExperimental.Header.Title>
                Add to Favorites
              </NavigationExperimental.Header.Title>
              <Button
                onPress={()=>null}
                title="Save"
              />
            </View>
            <Text>bar</Text>
            <Text>bar</Text>
          </View>
        </Modal>
        <Text
          style={{
            paddingTop:20,
          }}
          onPress={()=>{
              this.setState({visible:true});
            }}>
          Open
        </Text>
      </View>
    )
  }
}

storiesOf('Modal', module)
  .add('view ', () => {
    return (
      <ModalExample />
    )})
  .add('view2 ', () => {
    return (
      <ModalExample2 />
    )})
  .add('books ', () => {
    return (
      <BooksFromURL
        url="https://gist.github.com/uk-ar/7574cb6d06dfa848780f508073492d86"
      />
    )})

storiesOf('Text', module)
  .add('overflow', () => (
    //contentContainerStyle=
    <View style={{
      paddingTop:20,
      backgroundColor:"red",
      width:60,
      //height:40,
      //flexDirection:"row",
      alignSelf:"center",
      //overflow:"hidden"
    }}
    >
      <View style={{
        //width:20,
        //overflow:"hidden",
        flexDirection:"row",
      }}>
        <View style={{
          right:0,
          position:"absolute",
          flexDirection:"row",
        }}>
          <Text>long long text1</Text>
          <Text style={{
            backgroundColor:"blue",
            //right:0,
            //position:"absolute",
          }}
          >long long text2</Text>
        </View>
        {/* <View style={{
        height:20,
        width:20}}
        ></View> */}
      </View>
    </View>
  ))
  .add('overflow2 wrap with view', () => (
    //contentContainerStyle=
    <View
      style={{
        alignSelf:"flex-end",
        alignItems:"flex-end",
        marginTop:20,
      }}
    >
      <View style={{
        height:60,
        //width:40,
        //flexDirection:"row",
        //justifyContent:"flex-end",
        width:20,
        //width:40,
        //width:60,
      }}>
        <View
          style={{
            overflow:"hidden",
            flexDirection:"row",
            justifyContent:"flex-end",
            backgroundColor:"yellow",
            flexWrap:"nowrap",
          }}>
          <Text style={{
            //flexBasis:0
          }}>XYZ</Text>
          <Text style={{
            //backgroundColor:"blue",
            //right:0,
            //position:"absolute",
          }}
          >DDD</Text>
        </View>
      </View>
    </View>
  ))
  .add('overflow3 wrap with text', () => (
    //contentContainerStyle=
    <View
      style={{
        alignSelf:"flex-end",
        alignItems:"flex-end",
        marginTop:20,
      }}
    >
      <View style={{
        height:60,
        width:40,
        //flexDirection:"row",
        //justifyContent:"flex-end",
        //width:20,
      }}>
        <View style={{
          flexDirection:"row",
          justifyContent:"flex-end",
          flexWrap:"nowrap",
        }}>
        <Text
          style={{
          /* overflow:"hidden",
          flexDirection:"row",
             justifyContent:"flex-end", */
            //textAlign:"right",
            //writingDirection:"rtl",
          backgroundColor:"yellow",
          }}>
          <Text
          >
            XYZ</Text>
          <Text
            style={{
            //backgroundColor:"blue",
            //right:0,
            //position:"absolute",
          }}
          >DDD</Text>
        </Text>
        <View style={{height:20,width:10}}></View>
        </View>
      </View>
    </View>
  ))
