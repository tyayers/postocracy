<script lang="ts">
  import Header from "$lib/header.svelte";
  import ModalDialog from "$lib/modal-dialog.svelte";
  import { appService } from "$lib/app-service";
  import "../app.css"
  import { onMount } from "svelte";

  let modalDialogVisible = false;
  let modalDialogMessage = "";
  let modalSubmitButtonText = "OK";
  let modalDialogType = 0;
  let modalPromise: Promise<string> | undefined = undefined;
  let modalPromiseResolve: (value: string) => void;

  onMount(async () => {
    document.addEventListener("cancelEvent", () => {
      modalDialogVisible = false;
    });
  });

  appService.RegisterModalDialogHandler = modalDialog;

  function modalDialog(message: string, submitButtonText: string, type: number): Promise<string> {
    modalPromise = new Promise((resolve, reject) => {
      modalDialogMessage = message;
      modalDialogType = type;
      modalSubmitButtonText = submitButtonText;
      modalDialogVisible = true;
      modalPromiseResolve = resolve;
    });

    return modalPromise;
  }

  function modalResult(result: string): void {
    modalDialogVisible = false;
    modalPromiseResolve(result);
  }

  function sendCancel() {
      //First, we initialize our event
      const event = new Event('cancelEvent');
      // Next, we dispatch the event.
      document.dispatchEvent(event);
  }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={sendCancel} on:keyup={sendCancel}>
  <Header />

  {#if modalDialogVisible}
    <ModalDialog message={modalDialogMessage} submitButtonText={modalSubmitButtonText} type={modalDialogType} submit={modalResult}></ModalDialog>
  {/if}
  <slot />
</div>