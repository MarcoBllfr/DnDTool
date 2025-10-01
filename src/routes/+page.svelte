<script lang="ts">
  import {CalculatorSection, Button, NavBar,  MonstersGrimoire, HomeSection} from "$lib/components";
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
<video autoplay muted loop playsinline class="background-video">
  <source src="/background1.mp4" type="video/mp4" />
</video>
<div class="background-overlay"></div>
<div class="content">
  {#if IsRendered === "CalcTool"}
    <CalculatorSection />  
  {/if}

  {#if IsRendered === "MonstersGrimoire"}
    <div>
      <MonstersGrimoire />
    </div>
  {/if}

  {#if IsRendered === "home"}
    <HomeSection bind:IsRendered = {IsRendered}/>
  {/if}
  
</div>

<style>

  .background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1; 
    
  }
 .background-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(9px) brightness(0.8) saturate(150%);
    -webkit-backdrop-filter: blur(9px) brightness(0.8) saturate(150%);
    background: rgba(0, 0, 0, 0.55);
    z-index: -1;
  }

 
  .content {
    position: relative;
    z-index: 1;
  }
</style>