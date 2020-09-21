export interface Post{
    name    : string,
    dirPath : string,
    images  : PostImage[] ,
    content : string,
    metaData:PostMetaData|null
}

export interface PostImage{
  imageURL: string,
  selected:boolean
}

export interface PostMetaData{
  'title'      : string,
  'url'        : string,
  'beds'       : string,
  'baths'      : string,
  'size'       : string,
  'floorNumber': string,
  'price'       :string
  'features'   : string
}