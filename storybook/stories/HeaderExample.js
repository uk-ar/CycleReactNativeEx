import React from 'react';
import {
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  View,
  ListView,
  ScrollView,
  LayoutAnimation,
  TextInput
} from 'react-native';
import { storiesOf, action, linkTo } from '@kadira/react-native-storybook';
import util from 'util'
import _ from 'lodash'

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

import {BookCell} from '../../BookCell';
import {BookRow1} from '../../BookRow';
import {genActions2,Action} from '../../Action';
import {BookListView3,BookListView2,BookListView1,BookListView} from '../../BookListView';
import {LayoutableView} from '../../Closeable';
import {SwipeableButtons2,SwipeableActions,SwipeableRow3} from '../../SwipeableRow';
import {SwipeableListView} from '../../SwipeableListView';

import {withDebug,VerticalCenterView,TestListView,TestSectionListView,debugView} from './common'
import { Header, ItemsHeader, SearchHeader } from '../../Header';

storiesOf('ItemsHeader', module)
  .add('with search close', () =>
    <ItemsHeader
      section="search"
      close={true}
      />
  )
  .add('with search', () =>
    <ItemsHeader
      section="search"
      close={false}
    />
  )
  .add('with liked close', () =>
    <ItemsHeader
      section="liked"
      close={true}
    />
  )
  .add('with liked', () =>
    <ItemsHeader
      section="liked"
      close={false}
    />
  )
  .add('input', () =>
    <CenterView>
      <TextInput
        value="foo"
        autoFocus={true}
        onChangeText={action('ChangeText')}
      />
    </CenterView>
  )

/* storiesOf('SearchHeader', module)
 *   .add('with search close', () =>
 *     <SearchHeader
 *       close={true}
 *     />
 *   )
 *   .add('with search', () =>
 *     <SearchHeader
 *       close={false}
 *     />
 *   )*/
