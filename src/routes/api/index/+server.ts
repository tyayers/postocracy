import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DataProvider, NewPost } from '$lib/interfaces';
import { PostIndex, Post } from '$lib/interfaces';
import { DataProviderLocal } from '$lib/data-provider-local';
import { generateTimestampId } from '$lib/utils';

let provider: DataProvider = new DataProviderLocal();
let postsBuffer = provider.getFile("index.json");
let posts: PostIndex;
if(postsBuffer === undefined) {
  posts = new PostIndex(generateTimestampId());
}
else {
  posts = JSON.parse(postsBuffer.toString());
}
let postsChanged: boolean = false;
let pageSize: number = 5;

setInterval(() => {
  if (postsChanged) {
    postsChanged = false;
    console.log("Writing index file to disk...");
    provider.writeFile("index.json",  Buffer.from(JSON.stringify(posts), 'utf8'));
  }
}, 5000);

export const GET: RequestHandler = async ({ url }) => {
	return json(posts);
};

export const POST: RequestHandler = async ({ url, request }) => {
  let newPost: Post = await request.json();
  newPost.content = "";

  if (posts.count >= pageSize) {
    // We're over the page size, so roll over...
    console.log(`roll over: ${posts.index.length}, ${posts.count}, ${pageSize}`);
    let oldId: string = posts.id;
    let newId: string = generateTimestampId();
    posts.nextId = newId;
    provider.writeFile("index" + "_" + posts.id + ".json",  Buffer.from(JSON.stringify(posts), 'utf8'));
    posts.previousId = oldId;
    posts.nextId = "";
    posts.id = newId;
    posts.count = 0;
  }
  
  if (posts.index.length === pageSize) {
    // We're overwriting...
    console.log(`overwriting: ${posts.index.length}, ${pageSize}`)
    //posts.index.shift();
    posts.index.pop();
  }

  posts.count++;
  newPost.indexId = posts.id;
  //posts.index.push(newPost);
  posts.index.unshift(newPost);
  postsChanged = true;

  return json(posts);
};

export const PUT: RequestHandler = async ( {url, request }) => {
  let post: Post = await request.json();
  post.content = "";

  // First check in current index...
  const indexPost = posts.index.findIndex(originalPost => originalPost.id === post.id);
  if (indexPost >= 0) {
    posts.index[indexPost] = post;
    postsChanged = true;
  }

  // Now check if post needs to be updated in old index
  if (post.indexId != posts.id) {
    let indexBuffer = provider.getFile("index_" + post.indexId + ".json");
    if (indexBuffer) {
      let indexData: PostIndex = JSON.parse(indexBuffer.toString());
      const oldIndexPost = indexData.index.findIndex(originalPost => originalPost.id === post.id);
      if (oldIndexPost >= 0) {
        indexData.index[oldIndexPost] = post;
        provider.writeFile("index_" + post.indexId + ".json", Buffer.from(JSON.stringify(indexData), 'utf8'));
      }
      else
        console.error(`Could not update old post index data: ${post.id}, ${post.indexId}`);
    }
    else
      console.error(`Could not update old post index data: ${post.id}, ${post.indexId}`);
  }

  return json(posts);
};