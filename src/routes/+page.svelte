<script lang="ts">
  import { MonsterCalc, PlayerCalc, EncounterOutcome } from "$lib/components";
  let totalExp = $state(0);//totale exp mostri
  let expSum = $state(0); //somma exp mostri
  let multiplierState = $state(0);
  let monsterQuantity=$state(0);
  let numeroGiocatori = $state(1);
  let expTotale: Difficulty = $state({
  facile: 0,
  medio: 0,
  difficile: 0,
  mortale: 0
});
</script>

<div class="calc-container">
  <PlayerCalc  bind:numeroGiocatori={numeroGiocatori}
  bind:expTotale={expTotale}
  />

  <MonsterCalc 
  bind:totalExp={totalExp}
    bind:expSum={expSum}
    bind:multiplierState={multiplierState}
    bind:monsterQuantity={monsterQuantity}
    />

  <EncounterOutcome 
  bind:monsterTotalExp={totalExp}
    bind:expToGive={expSum}
    bind:monsterCount={monsterQuantity}
    bind:playerCount={numeroGiocatori}
    bind:playerExpThresholds={expTotale}/>
</div>

<style>
  .calc-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    .calc-container {
      flex-direction: row;
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
