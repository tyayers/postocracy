import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Post } from '$lib/interfaces';

export const POST: RequestHandler = async ({ url, request }) => {

  let postBody: Post = await request.json();

	return json(postBody);
};

export const GET: RequestHandler = async ({ url }) => {

	return json({
    posts: [
      {
        title: "Test post 1",
        author: "test@example.com",
        createdAt: "2018-12-30T20:59:00.000Z",
        tags: ["fruit"],
        content: "<div>test</div>"
      }
    ]
  });
};