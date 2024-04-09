import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DataProvider, NewPost } from '$lib/interfaces';
import { PostIndex, Post } from '$lib/interfaces';
import { DataProviderLocal } from '$lib/data-provider-local';

let provider: DataProvider = new DataProviderLocal();
let postsBuffer = provider.getFile("index.json");

export const GET: RequestHandler = async ({ url }) => {

  // const start = url.searchParams.get('start') ?? "0";
  // const length = url.searchParams.get('length') ?? "20";

  // let index: PostIndex;
  // let indexBuffer = provider.getFile("index.json");
  // if (!indexBuffer) 
  //   index = new PostIndex();
  // else
  //   index = JSON.parse(indexBuffer.toString());

	return json({
    status: "Ok"
  });
};

export const POST: RequestHandler = async ({ url, request }) => {

  const data = await request.formData();
  const authorId = data.get("authorId")?.toString();
  const authorDisplayName = data.get("authorDisplayName");
  const authorPhotoUrl = data.get("authorPhotoUrl");
  const title = data.get("title")?.toString();
  const content = data.get("content")?.toString();
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const yearString = currentDate.getFullYear().toString();
  const monthString: string = month < 10 ? "0" + month.toString() : month.toString();
  const dayString: string = day < 10 ? "0" + day.toString() : day.toString();
  const createdAt: string = currentDate.toISOString();
  const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);
  const postId: string = yearString + monthString + dayString + "_" + generateRandomString(8);

  if (!authorId || !title || !content) {
    error(400, 'Invalid post data sent.');
  }
  else {
    let newPost: Post = new Post(postId, authorId, title, createdAt);

    newPost.content = content;
    provider.createDir(newPost.id);
    provider.writeFile(newPost.id + "/content.json", Buffer.from(JSON.stringify(newPost), 'utf8'));

    return json(newPost);
  }
};

export const PUT: RequestHandler = async ( {url, request }) => {
  return json({
    status: "Ok"
  })
};
