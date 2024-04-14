<script lang="ts">
  import type { AppUser, PostIndex } from '$lib/interfaces';
  import { onMount } from 'svelte';
  import { appService } from '$lib/app-service';
  import { goto } from '$app/navigation';
  import PostCard from '$lib/component-post-card.svelte';

  let currentUser: AppUser | undefined = appService.currentUser;
  let posts: PostIndex | undefined = appService.posts;

  console.log("Home loaded, posts:")
  console.log(posts);

	onMount(() => {
    document.addEventListener("userUpdated", () => {
      console.log("userUpdated");
      console.log(appService.posts);

      if (appService.currentUser) {
        currentUser = appService.currentUser;
      }
    });

    document.addEventListener("postsUpdated", () => {
      if (appService.posts) {
        posts = appService.posts;
      }
      console.log("postsUpdated");
      console.log(posts);
    });

    if (appService.reloadFlag) {
      appService.reloadFlag = false;
      location.reload();
    }

    if (!appService.currentUser && appService.currentUserLoaded) {
      // This means no user is signed in, go to landing page
      console.log("No user, going to landing page...");
      goto("/");
    }
  });
</script>

<div class="central_two_panel_page">
  <div class="central_two_panel_content">
    <div class="central_two_panel_left">
      {#if posts}
        <div class="central_two_panel_left_inner">
          {#each posts.index as post}
            <PostCard {post} />
          {/each}
        </div>
      {:else}
        no posts!
      {/if}
    </div>
    <div class="central_two_panel_right">
      right-widget
    </div>
  </div>
</div>