export interface Post{
    name    : string,
    dirPath : string,
    images  : PostImage[] ,
    content : string,
    metaData:PostMetaData|null,
    postText:PostText[]
}

export interface PostImage{
  imageURL: string,
  selected:boolean
}
export interface PostText{
  text:string;
  language:string;
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

export interface ChannelCity{
  name: string, selected: boolean, lang:string ,currency:string
}