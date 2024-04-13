<script lang="ts">
import PostHeader from "$lib/component-post-header.svelte";

export let data;
</script>

<div class="post_content">

</div>

<div class="central_two_panel_page">
  <div class="central_two_panel_content">
    <div class="central_two_panel_left">
      {#if data.post}
        <div class="central_two_panel_left_inner">
          <PostHeader post={data.post} />
          <div class="post_content">
            <h1>{data.post.title}</h1>
            <div>{@html data.post.content}</div>
          </div>
        </div>
      {:else}
        post not found!
      {/if}
    </div>
    <div class="central_two_panel_right">
      right-widget2
    </div>
  </div>
</div>

<style>
  .post_content {
    max-width: 728px;
    flex: 1 1 auto;
    justify-content: center;
  }
</style>