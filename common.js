const STORAGE_KEY = '@CycleReactNativeEx:inBox'
//books search api cannot use query keyword
const RAKUTEN_SEARCH_API =
'https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?format=json&booksGenreId=001&applicationId=1088506385229803383&formatVersion=2&keyword='

const LIBRARY_ID = "Tokyo_Fuchu";

const CALIL_STATUS_API = `http://api.calil.jp/check?appkey=bc3d19b6abbd0af9a59d97fe8b22660f&systemid=${LIBRARY_ID}&format=json&isbn=`

var MOCKED_MOVIES_DATA = [
  {title: "はじめてのABCえほん", author: "仲田利津子/黒田昌代",
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7472/9784828867472.jpg?_ex=200x200",
   isbn: "9784828867472"
  },
  {title: "ぐりとぐら(複数蔵書)", author: "中川李枝子/大村百合子",
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200", isbn: "9784834000825",
   libraryStatus: {
     exist: true,
     rentable: true,
     reserveUrl: "http://api.calil.jp/reserve?id=af299d780fe86cf8b116dfda4725dc0f"
   }
  },
  {title: "ぐりとぐらの1ねんかん(単一蔵書)",
   author: "中川李枝子/山脇百合子（絵本作家）", isbn: "9784834014655",
   libraryStatus: {
     exist: true,
     rentable: true,
     reserveUrl: "https://library.city.fuchu.tokyo.jp/licsxp-opac/WOpacTifTilListToTifTilDetailAction.do?tilcod=1009710046217"},
   thumbnail: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4655/9784834014655.jpg?_ex=200x200"
  }
  //size 200x200 largeImageUrl 64x64
];

module.exports = {
  STORAGE_KEY,
  RAKUTEN_SEARCH_API,
  LIBRARY_ID,
  CALIL_STATUS_API,
  MOCKED_MOVIES_DATA,
}
