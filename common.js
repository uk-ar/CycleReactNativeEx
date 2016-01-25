const STORAGE_KEY = '@CycleReactNativeEx:inBox'
//books search api cannot use query keyword
const RAKUTEN_SEARCH_API =
'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword='

const LIBRARY_ID = "Tokyo_Fuchu";

const CALIL_STATUS_API = `http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`

module.exports = {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  CALIL_STATUS_API,
  LIBRARY_ID
}
