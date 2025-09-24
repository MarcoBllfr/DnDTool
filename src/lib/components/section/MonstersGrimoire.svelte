<script lang="ts">
  import { MonsterCard, MonsterInfo } from "$components";
  import { fade } from "svelte/transition";
  let whatISee = $state("monsterList");
</script>

{#if whatISee === "monsterList"}
  <div transition:fade>
    <MonsterCard bind:whatISee />
  </div>
{:else}
  <div transition:fade>
    <MonsterInfo bind:whatISee />
  </div>
{/if}
