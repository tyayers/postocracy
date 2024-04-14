import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DataProvider, NewPost } from '$lib/interfaces';
import { PostIndex, Post } from '$lib/interfaces';
import { DataProviderLocal } from '$lib/data-provider-local';
import { generatePostId } from '$lib/utils';

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
  let postId = data.get("postId")?.toString();
  const authorId = data.get("authorId")?.toString();
  const authorDisplayName: string | undefined = data.get("authorDisplayName")?.toString();
  const authorPhotoUrl: string | undefined = data.get("authorPhotoUrl")?.toString();
  const title = data.get("title")?.toString();
  const summary = data.get("summary")?.toString();
  const content = data.get("content")?.toString();
  const imageUrl = data.get("imageUrl")?.toString();
  const currentDate = new Date();
  const createdAt: string = currentDate.toISOString();

  if (!postId)
    postId = generatePostId();

  if (!authorId || !title || !content) {
    error(400, 'Invalid post data sent.');
  }
  else {
    let newPost: Post = new Post(postId, authorId, title, createdAt);
    if (authorDisplayName) newPost.authorDisplayName = authorDisplayName;
    if (authorPhotoUrl) newPost.authorPhotoUrl = authorPhotoUrl;
    if (summary) newPost.summary = summary;
    if (imageUrl) newPost.imageUrl = imageUrl;

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
