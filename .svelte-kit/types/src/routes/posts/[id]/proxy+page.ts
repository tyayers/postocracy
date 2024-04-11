// @ts-nocheck
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = async ({ fetch, params }: Parameters<PageLoad>[0]) => {

  const res = await fetch(`/api/posts/${params.id}`);
	const post = await res.json();

  return {
    post: post
  };
};

