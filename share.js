import ShareExtension from 'react-native-share-extension'
import React, { Component } from 'react'
//import Modal from 'react-native-modalbox'
import { BooksSaveView } from './BooksSaveView';

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native'

import {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID,
  log,
  Book,
  realm,
} from './common';

const initialBooks = realm.objects('Book')
                          .sorted('modifyDate', true)// reverse sort
                          .map((i) => i) // convert result to array
//.do(i=>console.log("read",i))
console.log("ib",initialBooks)

/* const initialBooks = realm.objects('Book')
 *                           .sorted('modifyDate', true)// reverse sort
 *                           .map((i) => i);// convert result to array
 * */
/* MySafariViewController.getAppGroupPath("group.org.reactjs.native.example.CycleReactNativeEx", (error, path) => {
 *   if (error) {
 *     console.error(error);
 *   } else {
 *     console.log('here:'+path);
 *   }
 * });*/

export default class Share extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
    } catch(e) {
      console.log('errrr', e)
    }
  }

  onClose() {
    ShareExtension.close()
  }

  closing = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
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
          <BooksSaveView
            url="https://gist.github.com/uk-ar/7574cb6d06dfa848780f508073492d86"
          />
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
    /* <Modal backdrop={false}
        style={{ backgroundColor: 'transparent' }} position="center" isOpen={this.state.isOpen} onClosed={this.onClose}>
        <View style={{ alignItems: 'center', justifyContent:'center', flex: 1 }}>
        <View style={{ borderColor: 'green', borderWidth: 1, backgroundColor: 'white', height: 200, width: 300 }}>
        <TouchableOpacity onPress={this.closing}>
        <Text>Close</Text>
        <Text>type: { this.state.type }</Text>
        <Text>value: { this.state.value }</Text>
        </TouchableOpacity>
        </View>
        </View>
        </Modal> */
  }
}
