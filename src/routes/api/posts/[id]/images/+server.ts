import { DataProviderLocal } from "$lib/data-provider-local";
import type { DataProvider } from "$lib/interfaces";
import { generateRandomString } from "$lib/utils";
import { error, json, type RequestHandler } from "@sveltejs/kit";

let provider: DataProvider = new DataProviderLocal();

export const POST: RequestHandler = async ({ url, params, request }) => {

  if (!params.id) {
    error(400, "Post id was not given.");
  }
  const data = await request.formData();
  const imageData = data.get("upload") as File;

  if (!imageData) {
    error(400, "No image data was received.");
  }

  let name: string = imageData.name;
  if (name === "image.png")
    name = "image_" + generateRandomString(5) + ".png";

  console.log(name);

  provider.createDir(params.id);
  let fileBuffer = await imageData.arrayBuffer();
  provider.writeFile(params.id + "/" + name, Buffer.from(fileBuffer));

  return json({
    url: "/api/posts/" + params.id + "/" + name
  });
};