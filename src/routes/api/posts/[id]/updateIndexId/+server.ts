import { DataProviderLocal } from "$lib/data-provider-local";
import type { DataProvider, Post } from "$lib/interfaces";
import { error, json, type RequestHandler } from "@sveltejs/kit";

let provider: DataProvider = new DataProviderLocal();

export const PUT: RequestHandler = async ( {url, params }) => {
  const indexId = url.searchParams.get('indexId') ?? "";
  const postId = params.id;

  if (!indexId || !postId) {
    console.error(`Post index id cannot be updated, invalid data sent: ${indexId}, ${postId}`);
    error(400, "Invalid data sent.");
  }
  else {

    let postBuffer = provider.getFile(postId + "/content.json");
    if (postBuffer) {
      let postData: Post = JSON.parse(postBuffer.toString());
      postData.indexId = indexId;
      provider.writeFile(postId + "/content.json", Buffer.from(JSON.stringify(postData), 'utf8'));
    }
    else {
      console.error(`Post index id cannot be updated, could not load post: ${indexId}, ${postId}`);
    }

    return json({
      status: "Ok"
    });
  }
};