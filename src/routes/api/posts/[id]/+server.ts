import { DataProviderLocal } from "$lib/data-provider-local";
import type { DataProvider, Post } from "$lib/interfaces";
import { convertPostFormToObject } from "$lib/utils";
import { error, json, type RequestHandler } from "@sveltejs/kit";

let provider: DataProvider = new DataProviderLocal();

export const GET: RequestHandler = async ({ params, url }) => {

  if (!params.id) {
    error(400, "Post id was not given.");
  }

  let postBuffer = provider.getFile(params.id + "/content.json");

  if (!postBuffer) {
    error(404, "Post content not found.");
  }

  return json(JSON.parse(postBuffer.toString()));
};

export const PUT: RequestHandler = async ( {url, request }) => {
  let postData: Post | undefined = undefined;
  const data = await request.formData();

  if (data) {
    postData = await convertPostFormToObject(data);
  }
  else {
    const requestJson = await request.json();
    if (requestJson) postData = await requestJson;
  }

  if (!postData)
    error(400, "Invalid post data sent.");
  else {
    provider.writeFile(postData.id + "/content.json", Buffer.from(JSON.stringify(postData), 'utf8'));

    return json(postData);
  }
};
