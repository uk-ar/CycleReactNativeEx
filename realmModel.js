const Realm = require('realm');
import {
  Platform,
  NativeModules,
} from 'react-native';

class Book {}
Book.schema = {
  name: 'Book',
  primaryKey: 'isbn',
  properties: {
    isbn: 'string',
    bucket: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    author: { type: 'string', optional: true },
    // Image raise error when src is null
    thumbnail: { type: 'string', optional:true },
    modifyDate: 'date',
  },
};

let realm;
if(Platform.OS === 'ios'){
  Realm.defaultPath = NativeModules.MySafariViewController.appGroupPath + "/baz.realm"
  realm = new Realm({ schema: [Book], schemaVersion: 4 });
} else {
  realm = new Realm({ schema: [Book], schemaVersion: 4 });
}

/* realm.write(() => {
 *   mockbooks.reverse().map((book) => {
 *     realm.create('Book',
 *                  {...book, modifyDate: new Date(Date.now())},
 *                  true)
 *   })
 * });*/
const initialBooks = realm.objects('Book')
                          .sorted('modifyDate', true)// reverse sort
                          .map((i) => i);// convert result to array

module.exports = {
  initialBooks,
  Book,
  realm,
  //makeEventEmitterDriver,
};
