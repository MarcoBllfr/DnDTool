<script lang="ts">
import { levelRules } from '$lib/data/LevelRules';
import Icon, { _api } from "@iconify/svelte";

interface Giocatore {
  livello: number;
}

interface Difficulty {
  facile: number;
  medio: number;
  difficile: number;
  mortale: number;
}

type Difficolta = keyof Difficulty;

let numeroGiocatori = $state(1);
let listaPlayer = $state<Giocatore[]>([]);

const difficoltaList: Difficolta[] = ['facile', 'medio', 'difficile', 'mortale'];

let expTotale: Difficulty = $state({
  facile: 0,
  medio: 0,
  difficile: 0,
  mortale: 0
});

// Usa $effect per aggiornare listaPlayer al cambiamento di numeroGiocatori
$effect(() => {
  if (numeroGiocatori > listaPlayer.length) {
    const nuovi = Array.from({ length: numeroGiocatori - listaPlayer.length }, () => ({ livello: 1 }));
    listaPlayer.push(...nuovi);
  } else if (numeroGiocatori < listaPlayer.length) {
    listaPlayer.length = numeroGiocatori;
  }
});

function calcolaExp() {
  difficoltaList.forEach(difficolta => {
    let tempExp = 0;
    listaPlayer.forEach(giocatore => {
      const bonus = levelRules[difficolta]?.[giocatore.livello] ?? 0;
      tempExp += bonus;
    });
    expTotale[difficolta] = tempExp;
  });
  expTotale = expTotale;
}

$effect(() => {
  if (listaPlayer.length > 0) {
    calcolaExp();
  }
});


</script>



{#snippet tabGiocatori()}
<div class="table-card">
  <table class="table">
    <thead>
      <tr>
        <th>Player</th>
        <th>Level</th>
      </tr>
    </thead>
    <tbody>
      {#each listaPlayer as giocatore, index}
      <tr>
        
        <td>{index + 1}</td>
        <td>
          <div class="number-input-container">
            <input
              type="number"
              min="1"
              max="20"
              bind:value={giocatore.livello}
              class="w-full"
              placeholder="1"
            />
            <div class="number-input-buttons">
              <button 
                class="number-btn"
                type="button"
                onclick={() => {
                  if(giocatore.livello < 20){
                    giocatore.livello += 1;
                  }
                }}
                aria-label="Increment"
              >
                <Icon icon="mdi:chevron-up" width="14" />
              </button>
              <button 
                class="number-btn"
                type="button" 
                onclick={() => {
                  if(giocatore.livello > 1){
                    giocatore.livello -= 1;
                  }
                }}
                aria-label="Decrement"
              >
                <Icon icon="mdi:chevron-down" width="14" />
              </button>
            </div>
          </div>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
{/snippet}

{#snippet tabExp()}
<div class="table-card">
  <table class="table">
    <thead>
      <tr>
        <th>Easy</th>
        <th>Medium</th>
        <th>Hard</th>
        <th>Deadly</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="important">{expTotale.facile}</td>
        <td class="important">{expTotale.medio}</td>
        <td class="important">{expTotale.difficile}</td>
        <td class="important">{expTotale.mortale}</td>
      </tr>
    </tbody>
  </table>
</div>
{/snippet}

<div class="container">
  <div class="card card hero-card">
    <h1 class="text-center mb-m">Heroes Calculator</h1>
    <div class="underscore mb-l"></div>
    
    <div class="mb-m">
      <label for="num" class="bold">
        <Icon icon="mdi:account-group" width="20" style="vertical-align: middle; margin-right: 8px;" />
        Number of Players:
      </label>
      <div class="number-input-container ml-2">
        <input
          id="num"
          type="number"
          bind:value={numeroGiocatori}
          class="w-full"
          placeholder="1"
        />
        <div class="number-input-buttons">
          <button 
            class="number-btn"
            type="button"
            onclick={() => {
                numeroGiocatori += 1;
            }}
            aria-label="Increment"
          >
            <Icon icon="mdi:chevron-up" width="14" />
          </button>
          <button 
            class="number-btn"
            type="button" 
            onclick={() => {
                numeroGiocatori -= 1;
            }}
            aria-label="Decrement"
          >
            <Icon icon="mdi:chevron-down" width="14" />
          </button>
        </div>
      </div>
    </div>
    

    {#if numeroGiocatori > 0}
      <div class="mb-m">
        <h3 class="mb-s">
          <Icon icon="mdi:sword" width="24" style="vertical-align: middle; margin-right: 8px;" />
          Party Configuration
        </h3>
        {@render tabGiocatori()}
      </div>
    {:else}
      <div class="card">
        <h3 class="text-center">Please enter the number of players</h3>
      </div>
    {/if}

    {#if expTotale.facile > 0}
      <div class="mb-m">
        <h3 class="mb-s">
          <Icon icon="mdi:treasure-chest" width="24" style="vertical-align: middle; margin-right: 8px;" />
          Experience Thresholds
        </h3>
        {@render tabExp()}
      </div>
      
      <div class="text-center mt-m">
        <button onclick={calcolaExp} class="btn btn-primary">
          <Icon icon="mdi:calculator" width="20" style="vertical-align: middle; margin-right: 8px;" />
          Recalculate Experience
        </button>
      </div>
    {:else}
      <div class="card text-center">
        <Icon icon="mdi:dice-d20" width="48" style="color: #8b0000;" />
        <h3 class="mt-s">Configure your party to see experience thresholds</h3>
        <p class="dark-grey">Add players and set their levels to calculate encounter difficulty</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .w-full {
    width: 30%;
  }
</style>