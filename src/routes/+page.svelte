<script lang="ts">
  import CalculatorSection from "$components/section/CalculatorSection.svelte";
  let IsRendered = $state("CalcTool");
</script>
{#if IsRendered === "CalcTool" }
  <CalculatorSection />  
{/if}
