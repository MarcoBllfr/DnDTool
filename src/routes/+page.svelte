<script lang="ts">
  import {CalculatorSection, Button, NavBar, MonsterCard} from "$lib/components";
  let IsRendered = $state("CalcTool");
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