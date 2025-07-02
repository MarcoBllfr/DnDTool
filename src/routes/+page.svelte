<script lang="ts">
  import {CalculatorSection, Button} from "$lib/components";
  let IsRendered = $state("CalcTool");
</script>
{#if IsRendered === "CalcTool" }
  <CalculatorSection />  
{/if}
