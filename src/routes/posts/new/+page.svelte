<script lang="ts">
	import { goto } from '$app/navigation';
	import { appService } from '$lib/app-service';
  import {generateId} from '$lib/utils';
  import Editor, { getData, setData } from '$lib/component-editor.svelte';
	import type { AppUser, Post, PostIndex } from '$lib/interfaces';
	import { onMount } from 'svelte';

  let currentUser: AppUser | undefined = appService.currentUser;
  let postId: string = generateId();

	onMount(() => {
    document.addEventListener("userUpdated", () => {
      if (appService.currentUser) {
        currentUser = appService.currentUser;
      }
    });

    setData("");
  });

  function saveDraft() {

  }

  function save() {
    var myForm: HTMLFormElement = document.getElementById(
      "new_post_form"
    ) as HTMLFormElement;

    const formData = new FormData(myForm);
    let content = getData();

    const regex = /<br>(?=(?:\s*<[^>]*>)*$)|(<br>)|<[^>]*>/gi;
    let text: string = content.replace(regex, (x, y) => (y ? " & " : ""));
    let textPieces: string[] = text.split(" ");
    let wordLimit = textPieces.length > 50 ? 50 : textPieces.length;
    let summaryText: string = "";
    for (var i = 0; i < wordLimit; i++) {
      summaryText += " " + textPieces[i];
    }
    if (textPieces.length > wordLimit) summaryText += "...";
    formData.set("postId", postId);
    if (appService.posts)
      formData.set("indexId", appService.posts?.id);
    formData.set("content", content);
    formData.set("summary", summaryText);
    if (currentUser) {
      formData.set("authorId", currentUser.id);
      formData.set("authorDisplayName", currentUser.userName);
      formData.set("authorPhotoUrl", currentUser.photoUrl);
    }

    // Get the first image, if there is one
    var el = document.createElement( 'tempElement' );
    el.innerHTML = content;
    let images = el.getElementsByTagName( 'img' );
    if (images && images.length > 0) {
      // Set first img as header image
      formData.set("imageUrl", images[0].src);
    }

    fetch("/api/posts", {
      method: "POST",
      body: formData
    }).then((result) => {
      return result.json();
    }).then((newPost: Post) => {
      createPost(newPost);
      goto("/home");
    })
  }

  function createPost(newPost: Post) {
    fetch("/api/index", {
      method: "POST",
      body: JSON.stringify(newPost)
    }).then((result) => {
      return result.json();
    }).then((newIndex: PostIndex) => {
      appService.posts = newIndex;
      document.dispatchEvent(new Event('postsUpdated'));

      if (newPost.indexId != newIndex.id) {
        // Posts were shifted, this belongs to a new index, need to update content file...
        fetch("/api/posts/" + newPost.id + "/updateIndexId?indexId=" + newIndex.id, {
          method: "PUT"
        }).then((result) => {
          console.log("Updated post index id.");
        });
      }
    });
  }
</script>

<div class="new_post_div">

  <form id="new_post_form">
    <!-- svelte-ignore a11y-autofocus -->
    <input
      type="text"
      name="title"
      id="title"
      placeholder="Title"
      required
      autofocus
    />

    <button class="rounded_button_outlined" style="position: relative; top: -7px;" on:click={save}>Save</button>

    <div>
      <Editor {saveDraft} imageUploadPath={"/api/posts/" + postId + "/images"}></Editor>
    </div>
  </form>
</div>

<style>
  .new_post_div {
    max-width: 904px;
    text-align: left;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 148px;
    padding: 0px 24px 0px 24px;
  }

  #title {
    font-size: 48px;
    border-style: none;
    outline: none;
    margin-left: 4px;
  }
</style>