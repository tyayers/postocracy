import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DataProvider, NewPost } from '$lib/interfaces';
import { PostIndex, Post } from '$lib/interfaces';
import { DataProviderLocal } from '$lib/data-provider-local';

const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);
let provider: DataProvider = new DataProviderLocal();
let postsBuffer = provider.getFile("index.json");
let postLimit: number = 5;
let posts: PostIndex;
if(postsBuffer === undefined) {
  posts = new PostIndex(generateRandomString(8));
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
    provider.writeFile("index.json",  Buffer.from(JSON.stringify(posts), 'utf8'))
  }
}, 5000);

export const GET: RequestHandler = async ({ url }) => {
	return json(posts);
};

export const POST: RequestHandler = async ({ url, request }) => {
  let newPost: Post = await request.json();
  newPost.content = "";

  if (posts.index.length < postLimit) {
    // Add to index
    newPost.indexId = posts.id;
    posts.index.push(newPost);
    postsChanged = true;
  }
  else {
    posts.id = generateRandomString(8);
  }

  return json(posts);
};

export const PUT: RequestHandler = async ( {url, request }) => {
  return json({
    status: "Ok"
  })
};
