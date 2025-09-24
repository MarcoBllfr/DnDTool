<script lang="ts">
  import {CalculatorSection, Button, NavBar,  MonstersGrimoire} from "$lib/components";
  import { decodeStateFromUrl } from "$lib/services/ShareService";
  import { onMount } from "svelte";
  
  let IsRendered = $state("home");

  async function getSectionFromUrl(): Promise<string> {
    try {
      const decodedState = await decodeStateFromUrl(window.location.search);
      
      if (!decodedState) return "home";
      
      const renderStatus = decodedState.renderStatus;
      
      if (["home", "CalcTool", "MonstersGrimoire"].includes(renderStatus)) {
        return renderStatus;
      }
    } catch (error) {
      console.error("Errore nel parsing di renderStatus da URL:", error);
    }

    return "home";
  }
  
  onMount(async () => {
    IsRendered = await getSectionFromUrl();
  });
</script>

<NavBar bind:IsRendered = {IsRendered} />
{#if IsRendered === "CalcTool" }
  <CalculatorSection />  
{/if}
{#if IsRendered === "MonstersGrimoire" }
 <div>
  <MonstersGrimoire />
 </div>
{/if}
{#if IsRendered === "home" }
 <div>
  this the home
 </div>
{/if}