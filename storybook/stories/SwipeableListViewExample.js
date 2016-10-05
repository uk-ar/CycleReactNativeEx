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

import {withDebug,VerticalCenterView,TestListView,debugView} from './common'

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
    return(
      <TestListView>
        {(dataSource)=>
          <SwipeableListView
            style={{paddingTop:20,flex:1}}
            generateActions={()=>genActions2('search')}
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
  .add('with lv add row', () => {
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
