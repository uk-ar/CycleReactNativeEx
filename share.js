import ShareExtension from 'react-native-share-extension';
import React, { Component } from 'react';
// import Modal from 'react-native-modalbox'
import { BooksSaveView } from './BooksSaveView';

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';

import {
  realm,
} from './realmModel.js';

/* const initialBooks = realm.objects('Book')
 *                           .sorted('modifyDate', true)// reverse sort
 *                           .map((i) => i) // convert result to array*/
// .do(i=>console.log("read",i))
// console.log("ib",initialBooks)

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
    super(props, context);
    this.state = {
      visible: true,
      type: '',
      value: ''
    };
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data();
      this.setState({
        type,
        value
      });
    } catch (e) {
      console.log('errrr', e);
    }
  }

  onClose() {
    ShareExtension.close();
  }

  closing = () => {
    this.setState({
      visible: false
    });
    ShareExtension.close();
  }

  render() {
    // console.log("state",this.state)
    // https://gist.github.com/uk-ar/7574cb6d06dfa848780f508073492d86
    // http://www.ehonnavi.net/ehon/18290/%E5%A4%A7%E5%9E%8B%E7%B5%B5%E6%9C%AC%E3%81%90%E3%82%8A%E3%81%A8%E3%81%90%E3%82%89%E3%81%AE%E3%81%88%E3%82%93%E3%81%9D%E3%81%8F/
    return (
      <View>
        <Modal
          animationType="slide"
          transparent
          visible={this.state.visible}
        >
          <BooksSaveView
            url={this.state.value}
            onSave={(books) => {
              realm.write(() => {
                  books.forEach((book) => {
                    realm.create('Book',
                      { ...book,
bucket: 'liked',
                        modifyDate: new Date(Date.now()) },
                                 true);
                  });
                });
              this.closing();
            }}
            onCancel={(books) => {
              this.closing();
            }}
          />
        </Modal>
      </View>
    );
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
