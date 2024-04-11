<script lang="ts">
	import type { AppUser, Post } from "$lib/interfaces";
	import { appService } from "$lib/app-service";

  export let onEnter: () => void;
  export let onLeave: () => void;
  export let followingChanged: (following: boolean) => void;

  export let user: AppUser;
  export let localUser: AppUser;
  export let userFollowing: boolean;
  export let size: string;

  function onMouseEnter() {
    if (onEnter) onEnter();
  }

  function onMouseLeave() {
    if (onLeave) onLeave();
  }

  function follow() {
    // appService.FollowUser(user.uid);
    userFollowing = true;
    followingChanged(userFollowing);
  }

  function unFollow() {
    // appService.UnFollowUser(user.uid);
    userFollowing = false;
    followingChanged(userFollowing);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={"popup_menu_panel_" + size}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <div class={"popup_menu_arrow " + "popup_menu_arrow_position_" + size} />
  <div class="popup_menu">
    {#if user}
      <div class="popup_menu_inner">
        <img
          alt="user profile"
          class="popup_user_image"
          width="24"
          src={user.photoUrl}
          referrerpolicy="no-referrer"
        />

        <span class="popup_user_name">
          <a href={"/" + user.userName}>{user.userName}</a>
        </span>

        <div class="user_stats_box">
          {#if user.postCount == 1}
            <span class="posts_count_box">{user.postCount} Post</span>
          {:else}
            <span class="posts_count_box"><b>{user.postCount}</b> Posts</span>
          {/if}

          {#if user.followerCount == 1}
            <span class="followers_count_box">{user.followerCount} Follower</span>
          {:else}
            <span class="followers_count_box"
              ><b>{user.followerCount}</b> Followers</span
            >
          {/if}
        </div>

        {#if user.id != localUser.id && !userFollowing}
          <button class="positive_button" on:click|preventDefault={follow}
            >Follow</button
          >
        {:else if user.id != localUser.id && userFollowing}
          <button class="negative_button" on:click|preventDefault={unFollow}
            >Unfollow</button
          >
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .popup_menu_panel_small {
    position: absolute;
    margin-top: 34px;
    z-index: 2;
  }

  .popup_menu_panel_large {
    position: absolute;
    margin-top: 48px;
    z-index: 2;
  }

  .popup_menu {
    position: relative;
    left: -14px;
    top: -10px;
    height: 140px;
    width: 260px;
    overflow-y: hidden;
    overflow-x: hidden;
    border-radius: 3px;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
    border: 1px solid rgb(242, 242, 242);
    border-radius: 4px;
    color: black;
  }

  .popup_menu_inner {
    position: relative;
    background: rgb(255, 255, 255);
    width: 100%;
    z-index: 2;
    padding: 14px;
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .popup_menu_arrow {
    position: relative;
    top: -22px;

    z-index: 1;
    border: 1px solid rgb(242, 242, 242);
    box-shadow: rgba(0, 0, 0, 0.15) -1px -1px 1px -1px;
    transform: rotate(45deg) translate(16px, 16px);
    background: rgb(255, 255, 255);
    height: 14px;
    width: 14px;
    display: block;
    content: "";
    pointer-events: none;
  }

  .popup_menu_arrow_position_small {
    left: 4px;
  }

  .popup_menu_arrow_position_large {
    left: 14px;
  }

  .popup_user_image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }

  .popup_user_name {
    position: relative;
    top: -6px;
    left: 4px;
  }

  .positive_button {
    position: absolute;
    right: 18px;
    top: 104px;
    cursor: pointer;
    user-select: none;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    margin-right: 20px;
    height: 25px;
    width: 65px;
    /* margin-top: 7px; */
    background: #1a8917;
    border-color: #1a8917;
    color: white;
  }

  .negative_button {
    position: absolute;
    right: 18px;
    top: 104px;
    cursor: pointer;
    user-select: none;
    border-radius: 5px;
    border-width: 1px;
    border-style: solid;
    margin-right: 20px;
    height: 25px;
    width: 65px;
    /* margin-top: 7px; */
    background: #ffffff;
    border-color: #d0d0d0;
    color: #5a5a5a;
  }

  .user_stats_box {
    margin-top: 14px;
  }

  .posts_count_box {
    margin-left: 2px;
  }

  .followers_count_box {
    margin-left: 34px;
  }
</style>
