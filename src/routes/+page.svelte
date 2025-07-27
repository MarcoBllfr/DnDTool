<script lang="ts">
  import {CalculatorSection, Button, NavBar} from "$lib/components";
  let IsRendered = $state("CalcTool");
</script>
<NavBar bind:IsRendered = {IsRendered} />
{#if IsRendered === "CalcTool" }
  <CalculatorSection />  
{/if}
{#if IsRendered === "MonstersGrimoire" }
 <div>
  this is the Monsters Grimoire
 </div>
{/if}
{#if IsRendered === "home" }
 <div>
  this the home
 </div>
{/if}