import {
  StyleSheet,
  PixelRatio,
} from 'react-native';
import materialColor from 'material-colors';

const cellWidth = 64;
const styles = StyleSheet.create({
  // BookCell
  row: {
    flexDirection: 'row',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  bookAuthor: {
    // color: '#999999',
    color: '#9E9E9E', // grey
    fontSize: 12,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 64, // PixelRatio 2
    margin: 10,
    width: cellWidth,
  },
  // view.js
  sectionHeader: {
    backgroundColor: materialColor.grey['200'],
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    // marginTop:3,
    padding: 10,
    flexDirection: 'row',
  },
  sectionFooter: {
    // backgroundColor:materialColor.grey["200"],
    backgroundColor: materialColor.grey['50'],
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: 5,
    marginBottom: 3, // separator is better?
    padding: 10,
    //height:30,
  },
  // for toolBar
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  iconContainer: {
    /* backgroundColor: 'deepskyblue', */
    backgroundColor: 'orange',
    /* borderRadius: 15, */
    borderRadius: 23,
    /* padding: 8, */
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 7,
  },
  libIcon: {
    textAlign: 'center',
    width: 30,
    color: 'white',
  },
  // for listview
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noMoviesText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  // for cell
  textContainer: {
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    // alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  segmented: {
    flex: 1,
    backgroundColor: 'black',
  },
  icon: {
    // width: 50
  },
  toolbarButton: {
    // width: 50,            //Step 2
    // textAlign:'center',
    flex: 1,                //Step 3
  },
  toolbarTitle: {
    // alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,                //Step 3
  },
});

module.exports = { styles, cellWidth };
