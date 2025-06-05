<script>
  import { MonsterCalc, PlayerCalc } from "$lib/components";
  const { data } = $props();
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
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    .calc-container {
      flex-direction: row;
      align-items: stretch;
      gap: 2rem;
      padding: 0 2rem;
    }

    .calc-container > :global(*) {
      flex: 1;
      max-width: 50%;
    }

    .calc-container > :global(* .card) {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .calc-container > :global(* .card-content) {
      flex: 1;
    }
    .calc-container > :global(* .button-container) {
      margin-top: auto;
      padding-top: 1rem;
    }
  }

  @media (min-width: 1200px) {
    .calc-container {
      gap: 3rem;
      padding: 0 3rem;
    }
  }
</style>
