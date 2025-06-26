<script lang="ts">
import { levelRules } from '$lib/data/LevelRules';
import Icon from "@iconify/svelte";

  import { browser } from '$app/environment';
  import { loadDataPlayer, resetPlayerData, saveDataPlayer } from '$services/LocalStorage';


type Difficolta = keyof Difficulty;


let { 
  numeroGiocatori = $bindable(1),
  
  } = $props();
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

$effect(() => {
  
  if (listaPlayer.length > 0) {
    saveDataPlayer({
      players: {
        numeroGiocatori,
        listaPlayer,
        expTotale
      },
      lastSaved: new Date().toISOString()
    });
  }
});
if (browser) {
  const saved = loadDataPlayer();
  if (saved) {
    numeroGiocatori = saved.players.numeroGiocatori;
    listaPlayer = saved.players.listaPlayer;
    expTotale = saved.players.expTotale;
  }
}
function resetPlayer(){
  const data=resetPlayerData();
  numeroGiocatori=data.players.numeroGiocatori;
  listaPlayer=data.players.listaPlayer;
  expTotale = data.players.expTotale;
}
</script>


{#snippet tabGiocatori()}
  <div class="players-table-wrapper">
    <table class="players-table">
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
                class="player-level-input"
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
        <button onclick={resetPlayer} class="btn btn-primary">
          <Icon icon="bx:reset" width="20" style="vertical-align: middle; margin-right: 8px;" />
          Reset player
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
  .players-table-wrapper {
    max-height: 300px; 
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .players-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  .players-table thead {
    position: sticky;
    top: 0;
    background: var(--card-bg-color, #fff);
    z-index: 1;
  }

  .players-table thead th {
    padding: 0.75rem;
    border-bottom: 2px solid var(--border-color);
    background: var(--card-bg-color, #fff);
    text-align: center;
  }

  .players-table tbody tr {
    border-bottom: 1px solid var(--border-color);
  }

  .players-table tbody tr:last-child {
    border-bottom: none;
  }

  .players-table tbody td {
    padding: 0.75rem;
    text-align: center;
  }

  .number-input-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 120px;
    margin: 0 auto;
  }

  .player-level-input {
    font-family: inherit;
    background: var(--input-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem;
    color: var(--text-color);
    width: 60px;
    min-width: 50px;
    text-align: center;
  }

  .player-level-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
  }

  .number-input-buttons {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .number-input-buttons .number-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
    background: var(--input-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }

  .number-input-buttons .number-btn:hover {
    background: var(--accent-color);
    color: white;
  }

  
  .players-table-wrapper::-webkit-scrollbar {
    width: 8px;
  }

  .players-table-wrapper::-webkit-scrollbar-track {
    background: var(--input-bg-color, #f1f1f1);
    border-radius: 4px;
  }

  .players-table-wrapper::-webkit-scrollbar-thumb {
    background: var(--border-color, #c1c1c1);
    border-radius: 4px;
  }

  .players-table-wrapper::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color, #8b0000);
  }

  @media (min-width: 768px) {
    .players-table-wrapper {
      max-height: 320px; 
    }
    
    .number-input-container {
      max-width: 140px;
      gap: 10px;
    }
    
    .player-level-input {
      width: 70px;
    }
    
    .number-input-buttons .number-btn {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
  }
</style>