<script lang="ts">
  import { goto } from "$app/navigation";
  import { MonsterCalc, PlayerCalc, EncounterOutcome,ShareButton } from "$lib/components";
  import { buildUrlFromState, applyStateFromUrl } from "$lib/services/ShareService";
  import { onMount } from "svelte";

  let calcState: CalcState = $state({
    renderStatus: "CalcTool",
    totalExp: 0,
    expSum: 0,
    multiplierState: 0,
    monsterQuantity: 0,
    numeroGiocatori: 1,
    expTotale: {
      facile: 0,
      medio: 0,
      difficile: 0,
      mortale: 0
    },
    listaPlayer: [],
    listaMonster: [],
    monsterGroup: 1
  });

  const stateSetters = new Map<keyof CalcState, (value: any) => void>([
    ['renderStatus',     (v) => calcState.renderStatus = String(v)],
    ['totalExp',         (v) => calcState.totalExp = +v],
    ['expSum',           (v) => calcState.expSum = +v],
    ['multiplierState',  (v) => calcState.multiplierState = +v],
    ['monsterQuantity',  (v) => calcState.monsterQuantity = +v],
    ['numeroGiocatori',  (v) => calcState.numeroGiocatori = +v],
    ['expTotale',        (v) => calcState.expTotale = v],
    ['listaPlayer',      (v) => calcState.listaPlayer = v],
    ['listaMonster',     (v) => calcState.listaMonster = v],
    ['monsterGroup',     (v) => calcState.monsterGroup = +v],
  ]);

  function setVar(key: string, value: any) {
    if (stateSetters.has(key as keyof CalcState)) {
      const setter = stateSetters.get(key as keyof CalcState);
      setter?.(value);
    }
  }

  onMount(() => {
    applyStateFromUrl(window.location.search, setVar);
    goto ("/"); //clean the url
  });
</script>

<ShareButton calcState={calcState} />

<div class="calc-container">

  <PlayerCalc  
    bind:numeroGiocatori={calcState.numeroGiocatori}
    bind:expTotale={calcState.expTotale}
    bind:listaPlayer={calcState.listaPlayer}
  />

  <MonsterCalc 
    bind:totalExp={calcState.totalExp}
    bind:expSum={calcState.expSum}
    bind:multiplierState={calcState.multiplierState}
    bind:monsterQuantity={calcState.monsterQuantity}
    bind:listaMonster={calcState.listaMonster}
    bind:monsterGroup={calcState.monsterGroup}
  />

  <EncounterOutcome 
    bind:monsterTotalExp={calcState.totalExp}
    bind:expToGive={calcState.expSum}
    bind:monsterCount={calcState.monsterQuantity}
    bind:playerCount={calcState.numeroGiocatori}
    bind:playerExpThresholds={calcState.expTotale}
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