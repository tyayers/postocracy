import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ( {url, request }) => {
  const indexId = url.searchParams.get('indexId') ?? "";
  
  return json({
    status: "Ok"
  })
};