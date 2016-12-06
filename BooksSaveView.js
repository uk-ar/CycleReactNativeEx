import React, { Component } from 'react'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  StatusBar,
  NavigationExperimental,
  Platform,
  StyleSheet,
  Button,
  ListView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import emptyFunction from 'fbjs/lib/emptyFunction';

import {BookCell} from './BookCell';

const RAKUTEN_ISBN_API =
  'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&applicationId=1088506385229803383&formatVersion=2&isbnjan=';

class BooksFromURL extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      books: null,
      dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }
  //https://gist.github.com/uk-ar/7574cb6d06dfa848780f508073492d86
  componentDidMount(){
    const { url, onProgress, onComplete, ...props } = this.props;

    fetch(url)
      .then(response => response.text())
      .then(text => {
        let isbns = text.match(/\b978\d{10}\b/g)
        this.setState({
          books: isbns.map(isbn => ({ isbn }))
        })
        return isbns
      })
      .then(isbns =>{
        //console.log("isbns",isbns)
        //let books = [];
        isbns.forEach((isbn,index) =>
          //fetch('http://www.hanmoto.com/api/book.php?ISBN='+isbn)
          //fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:'+isbn)
          setTimeout(()=>{
            fetch(RAKUTEN_ISBN_API+isbn)
            //.then(response => response.ok )
              .then(response => {
                //console.log(response)
                return response.json()
              })
              .then(body =>{
                //console.log("b",body)
                let { title, author, isbn, largeImageUrl } = body.Items[0]
                //let { title, authors, largeImageUrl } = body.items[0].volumeInfo
                let book = {
                  title: title.replace(/^【バーゲン本】/, ''),
                  author: author,
                  isbn,
                  thumbnail: largeImageUrl,
                }
                return book;
              }).done( book =>{
                //books[isbn]=res
                this.setState((prevState)=>{
                  prevState.books[index] = book
                  onProgress(index+1,isbns.length)
                  if(index+1 === isbns.length){
                    onComplete(prevState.books);
                  }
                  return {
                    books:[...prevState.books]
                  }
                })
              })},index*1000)
        )
      })
    /* .catch(error=>{
     *   //console.log("error",error,url)
     *   setTimeout(()=>{Alert.alert(
     *     'Alert',
     *     "There is no isbn in this page.",
     *     [
     *       {text: 'OK', onPress: () => console.log('Should close')},
     *     ]
     *   )
     *   })
     * })*/
  }
  render(){
    const { url, onProgress, ...props } = this.props
    //console.log("render",this.state.books)
    if(this.state.books === null){
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
        {...props}
        dataSource={this.state.dataSource.cloneWithRows(this.state.books)}
        renderRow={(rowData) =>{
            //console.log("rd",rowData)
            return <BookCell book={rowData}/>
          }}
      />)
  }
}

BooksFromURL.propTypes = {
  url: React.PropTypes.string.isRequired,
  onProgress: React.PropTypes.func,
};
BooksFromURL.defaultProps = {
  onProgress: emptyFunction
};

class BooksSaveView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processed:0,
      total:0,
      books:[],
    }
  }
  render(){
    const { url, onCancel, onSave, ...props } = this.props
    //console.log("bool",this.state.books.length !== 0)
    return(
      <View
        style={{
          //
          flex:1,
          //justifyContent:"center",
          backgroundColor: '#EBEBF1',
        }}
      >
        <StatusBar barStyle="dark-content"/>
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
            onPress={onCancel}
            title="Cancel"
          />
          <NavigationExperimental.Header.Title>
            Add to Favorites
          </NavigationExperimental.Header.Title>
          <Button
            onPress={()=>onSave(this.state.books)}
            disabled={this.state.books.length === 0}
            title="Save"
          />
        </View>
        <Text>
          { this.state.total !== 0 ?
            `${this.state.processed}/${this.state.total}件を処理` :
            "" }
        </Text>
        {url==='' ?
         <ActivityIndicator
           size="large"
           style={{
             //alignItems:'center',
             //justifyContent:'center',
             flex:1,
             height:80}}
         /> :
         <BooksFromURL
           style={{backgroundColor: '#FFFFFF'}}
           url={url}
           onProgress={(i,t)=>this.setState({
               processed:i,
               total:t
             })}
           onComplete={(books)=>this.setState({books})}
         />}
      </View>
    )
  }
}

BooksSaveView.propTypes = {
  url: React.PropTypes.string.isRequired,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
};
BooksSaveView.defaultProps = {
  onCancel: emptyFunction,
  onSave: emptyFunction,
};

module.exports = { BooksSaveView, BooksFromURL };
