import { DataProviderLocal } from "$lib/data-provider-local";
import type { DataProvider } from "$lib/interfaces";
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
