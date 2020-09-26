import { Post, ChannelCity } from "../models/post.interface";
import { ConfigHelper } from "../helpers/config.helper";
import { CraigslistPoster } from "../channels/craigslist/craigslist.group.poster";
import { PostsHelper } from "../helpers/posts.helper";

export class QueueScheduler{
    public queuedPosts:Array<Post> = [];
    private readonly defaultPost = {
        name:'bangkok',
        selected:true,
        lang:'thai',
        currency:'THB'
    };

    private async buildQueue(){
        let postsFetch = (await PostsHelper.getListOfPosts());
        // let post
        for(let postDir of postsFetch.postsDirs){
            let post = PostsHelper.getPostByName(postDir);
            this.queuedPosts.push(post);
        }

        this.queuedPosts = this.shuffle(this.queuedPosts);
    }

    public async handleQueue(){
        if(this.queuedPosts.length === 0){
            this.buildQueue();
        }

        let currentPost = this.queuedPosts.pop(); 
        this.handleQueueItem(currentPost,this.defaultPost);
    }

    private async handleQueueItem(post:Post,city:ChannelCity){
        let config = ConfigHelper.getConfig();
        var result = false;
        try {
            // let price = await PostsHelper.handlePostPrice(post,city.currency);
            let poster = new CraigslistPoster(
              {
                username: config.craigslist_email,
                password: config.craigslist_password
              },
              post.images,
              ConfigHelper.parseTextTemplate(post,city.lang),
              post?.metaData?.title,
              'Pattaya',
              post.metaData?.price,
              post?.metaData?.size,
              ConfigHelper.getConfigValue('phone_number'),
              ConfigHelper.getConfigValue('phone_extension'),
              city.name,
              ConfigHelper.getConfigValue('post_immediately',false)
            );
        
            result = await poster.run();
          } catch (e) {
            result = false;
            console.error(e);
          }

          return result;
    }


    private shuffle(array:any[]) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex = currentIndex - 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
}