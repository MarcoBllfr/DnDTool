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
  <PlayerCalc  
    bind:numeroGiocatori={numeroGiocatori}
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
    bind:playerExpThresholds={expTotale}
  />
</div>



<style>
  .calc-container {
    display: grid;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
    grid-template-columns: 1fr;
    overflow-x: hidden;
    min-height: 0;
  }


  @media (min-width: 768px)  {
    .calc-container {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1.5rem;
      padding: 0 2rem;
      grid-template-rows: auto auto;
    }
    
    
    .calc-container > :global(:nth-child(3)) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }


  @media (min-width: 1200px) {
    .calc-container {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
      gap: 2rem;
      padding: 0 3rem;
      grid-template-rows: auto;
    }
    
   
    .calc-container > :global(:nth-child(3)) {
      grid-column: auto;
      grid-row: auto;
    }
  }

 
  .calc-container > :global(*) {
    display: flex;
    flex-direction: column;
    min-width: 0; /* Previene overflow */
    min-height: 0;
  }

  .calc-container > :global(* .card) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden; 
  }

  .calc-container > :global(* .card-content) {
    flex: 1;
    overflow-y: auto; 
    min-height: 0;
  }

  .calc-container > :global(* .button-container) {
    margin-top: auto;
    padding-top: 1rem;
    flex-shrink: 0; 
  }

 
  .calc-container > :global(* .table-card) {
    overflow-x: auto;
    min-width: 0;
  }

  .calc-container > :global(* table) {
    min-width: 0;
    word-break: break-word;
  }
</style>