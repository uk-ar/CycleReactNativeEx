import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ListView,
  ScrollView
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {genActions2,Action} from '../../Action';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';

import {SwipeableListView} from '../../SwipeableListView';
import {LayoutableView} from '../../Closeable';

import util from 'util';

function debugView(string) {
  return function (props){
    return (
      <View style={{ height: 200, backgroundColor:"green" }}>
        <Text>{string}:{util.inspect(props)}</Text>
      </View>);
  }
}

class TestListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
    this.data = ['row 0', 'row 1'];
  }
  componentWillMount(){
    this.setState({ds:this.state.ds.cloneWithRows(this.data)})
  }
  render(){
    //console.log(this.state.ds._dataBlob.s1)
    return(
      <View
        style={{flex:1}}>
        <Text
          onPress={()=>{
              this.data.push(`row ${this.data.length}`)
              this.setState({ds:this.state.ds.cloneWithRows(this.data)})
            }}>
          pressMe
        </Text>
        { this.props.children(this.state.ds) }
      </View>
    )
  }
}

storiesOf('SwipeableListView', module)
/* .addDecorator(getStory => (
 *   <CenterView>{getStory()}</CenterView>
 * ))*/
  .add('with listview', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        style={{paddingTop:20}}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with book', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <SwipeableListView
        style={{paddingTop:20}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with callback', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <SwipeableListView
        style={{paddingTop:20}}
        generateActions={()=>genActions2('search')}
        dataSource={ds.cloneWithRows(['row 1', 'row 2'])}
        onSwipeEnd={action('swipeEnd')}
        onSwipeStart={action('swipeStart')}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    )
  })
  .add('with add row', () => {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <TestListView>
        {(dataSource)=>
          <ListView
            style={{paddingTop:20,flex:1}}
            dataSource={dataSource}
            renderRow={(rowData,rowID,sectionID) =>
              <LayoutableView>
                <View>
                      {debugView("row")(rowData,rowID,sectionID)}    
                </View>
              </LayoutableView>
                      }
          />
        }
      </TestListView>
    )
  })


