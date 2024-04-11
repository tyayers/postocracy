<script lang="ts">
	import type { Post } from "$lib/interfaces";

  export let post: Post;

</script>

<div class="post_card_div">
  <a href={"/posts/" + post.id}>
    <div class="post_card_inner">
      <div class="post_card_user">
        <div class="post_card_profile">
          <img
            class="post_card_profile"
            width="24"
            alt="Profile of user"
            src={post.authorPhotoUrl}
          />
        </div>
        <div class="post_card_byline">
          <a href={"/" + post.authorId}>{post.authorDisplayName}</a> · {new Date(
            post.createdAt
          ).toDateString()}
        </div>
      </div>
      <div class="post_card_content">
        <div class="post_card_content_body">
          <span
            class:post_card_content_left={post.image}
            class:post_card_content_left_full={!post.image}
          >
            <h2 class="title">{post.title}</h2>
            {@html post.summary}
          </span>
        </div>
      </div>
    </div>
  </a>
</div>

<style>
  .post_card_div {
    cursor: pointer;
    display: flex;
    margin-bottom: 40px;
    margin-top: 15px;
    padding-top: 30px;
  }

  .post_card_inner {
    margin: 0px 24px;
    max-width: 680px;
    height: 100%;
  }

  .post_card_user {
    display: flex;
  }

  .post_card_profile {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }

  .post_card_byline {
    position: relative;
    top: 3px;
    left: 6px;
  }

  .post_card_content {
    text-align: left;
    text-decoration: none;
  }

  .post_card_content_body {
    display: flex;
  }

  .post_card_content_left {
    width: 70%;
  }

  .post_card_content_left_full {
    width: 100%;
  }  
</style>