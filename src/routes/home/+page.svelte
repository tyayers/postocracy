<script lang="ts">
  import type { AppUser } from '$lib/interfaces';
  import { onMount } from 'svelte';
  import { appService } from '$lib/app-service';
  import { goto } from '$app/navigation';

  let currentUser: AppUser | undefined = appService.currentUser;

	onMount(() => {
    document.addEventListener("userUpdated", () => {
      if (appService.currentUser) {
        currentUser = appService.currentUser;
      }
    });

    if (appService.reloadFlag) {
      appService.reloadFlag = false;
      location.reload();
    }

    if (!appService.currentUser && appService.currentUserLoaded) {
      // This means no user is signed in, go to landing page
      goto("/");
    }
  });
</script>

<div>
  hello world!
</div>