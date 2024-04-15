import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {

  const res = await fetch(`/api/posts/${params.id}`);
	const post = await res.json();

  return {
    post: post
  };
};

