import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DataProvider, NewPost } from '$lib/interfaces';
import { PostIndex, Post } from '$lib/interfaces';
import { DataProviderLocal } from '$lib/data-provider-local';
import { convertPostFormToObject, generateId } from '$lib/utils';

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
  let postData: Post | undefined = await convertPostFormToObject(data);

  if (!postData) {
    error(400, 'Invalid post data sent.');
  }
  else {
    provider.createDir(postData.id);
    provider.writeFile(postData.id + "/content.json", Buffer.from(JSON.stringify(postData), 'utf8'));

    return json(postData);
  }
};




