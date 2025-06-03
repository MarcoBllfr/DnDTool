<script>
  import { MonsterCalc, PlayerCalc} from "$lib/components";
const {data} = $props();

</script>
<div class="calc-container">
  <PlayerCalc />
  <MonsterCalc />
</div>

<style>
  .calc-container {
    display: flex;
    flex-direction: column; 
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .calc-container {
      flex-direction: row; 
    }
  }
</style>