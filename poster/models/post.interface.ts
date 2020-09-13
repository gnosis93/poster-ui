export interface Post{
    name    : string,
    dirPath : string,
    images  : PostImage[] ,
    content : string
}

export interface PostImage{
  imageURL: string,
  selected:boolean
}
