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
  'beds'       : number,
  'baths'      : number,
  'size'       : string,
  'floorNumber': string,
  'price'       :string

}