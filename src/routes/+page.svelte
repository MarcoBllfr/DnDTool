<script lang="ts">
  import {CalculatorSection, Button, NavBar, MonsterCard} from "$lib/components";
  import { onMount } from "svelte";
  let IsRendered = $state("home");

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  return atob(str);
}

function getSectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("s");

  if (!encoded) return "home";

  try {
    const json = base64UrlDecode(encoded);
    const parsed = JSON.parse(json);
    const renderStatus = parsed.renderStatus;

    if (["home", "CalcTool", "MonstersGrimoire"].includes(renderStatus)) {
      return renderStatus;
    }
  } catch (e) {
    console.error("Errore nel parsing di renderStatus da URL:", e);
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