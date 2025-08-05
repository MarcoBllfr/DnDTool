<script lang="ts">
  import {CalculatorSection, Button, NavBar, MonsterCard} from "$lib/components";
  import { onMount } from "svelte";
  let IsRendered = $state("home");

 function getSectionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const renderStatus = params.get("renderStatus") as string;
    if (["home", "CalcTool", "MonstersGrimoire"].includes(renderStatus)) {
      return renderStatus;
    }
    return "home";
  }
  onMount(() => {
    IsRendered = getSectionFromUrl();
  });
  
</script>
<NavBar bind:IsRendered = {IsRendered} />
{#if IsRendered === "CalcTool" }
  <CalculatorSection />  
{/if}
{#if IsRendered === "MonstersGrimoire" }
 <div>
  <MonsterCard />
 </div>
{/if}
{#if IsRendered === "home" }
 <div>
  this the home
 </div>
{/if}