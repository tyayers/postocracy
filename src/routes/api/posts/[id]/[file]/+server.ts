import { DataProviderLocal } from "$lib/data-provider-local";
import type { DataProvider } from "$lib/interfaces";
import { error, json, type RequestHandler } from "@sveltejs/kit";

let provider: DataProvider = new DataProviderLocal();

export const GET: RequestHandler = async ({ params, url }) => {

  if (!params.id || !params.file) {
    error(400, "Image info not given.");
  }

  let imageBuffer = provider.getFile(params.id + "/" + params.file);

  if (!imageBuffer) {
    error(404, "Image not found.");
  }

  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};
