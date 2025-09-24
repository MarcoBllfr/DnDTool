<script lang="ts">
  import {MonsterCard, MonsterInfo} from "$components";

  let whatISee = $state("monsterList")
  
</script>
{#if whatISee==="monsterList"}
    <MonsterCard bind:whatISee={whatISee}/>
    {:else}
    <MonsterInfo bind:whatISee={whatISee}/>
{/if}