<script lang="ts">
  import { levelRules } from '$lib/data/LevelRules';
  import Icon from "@iconify/svelte";
  
    import { browser } from '$app/environment';
    import { loadDataPlayer, resetPlayerData, saveDataPlayer } from '$services/LocalStorage';
  
  
  type Difficolta = keyof Difficulty;
  
  
  let { 
    numeroGiocatori = $bindable(1),
    expTotale= $bindable<Difficulty>({
      facile: 0,
      medio: 0,
      difficile: 0,
      mortale: 0
    })
    } = $props();
  let listaPlayer = $state<Giocatore[]>([]);
  
  const difficoltaList: Difficolta[] = ['facile', 'medio', 'difficile', 'mortale'];
  
  // Mappatura per etichette in inglese e icone
  const difficultyConfig = {
    facile: { 
      label: 'Easy', 
      icon: 'mdi:shield-check', 
      color: '#10b981', 
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    medio: { 
      label: 'Medium', 
      icon: 'mdi:shield', 
      color: '#f59e0b', 
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    difficile: { 
      label: 'Hard', 
      icon: 'mdi:shield-alert', 
      color: '#ef4444', 
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    mortale: { 
      label: 'Deadly', 
      icon: 'mdi:skull', 
      color: '#7c2d12', 
      bgColor: 'rgba(124, 45, 18, 0.1)',
      borderColor: 'rgba(124, 45, 18, 0.3)'
    }
  };
  
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
            <td class="player-number">{index + 1}</td>
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
  
  {#snippet expCards()}
    <div class="exp-cards-grid">
      {#each difficoltaList as difficolta}
        <div 
          class="exp-card" 
          style="
            --card-color: {difficultyConfig[difficolta].color};
            --card-bg: {difficultyConfig[difficolta].bgColor};
            --card-border: {difficultyConfig[difficolta].borderColor};
          "
        >
          <div class="exp-card-header">
            <Icon 
              icon={difficultyConfig[difficolta].icon} 
              width="24" 
              style="color: {difficultyConfig[difficolta].color};" 
            />
            <h4 class="exp-card-title">{difficultyConfig[difficolta].label}</h4>
          </div>
          <div class="exp-card-value">
            {expTotale[difficolta]}
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
  
  <div class="container">
    <div class="card card hero-card">
      <h1 class="text-center mb-m">Heroes Calculator</h1>
      <div class="underscore mb-l"></div>
      
      <div class="player-input-section">
        <label for="num" class="input-label">
          <Icon icon="mdi:account-group" width="20" />
          Number of Players:
        </label>
        <div class="number-input-container">
          <input
            id="num"
            type="number"
            bind:value={numeroGiocatori}
            class="main-input"
            placeholder="1"
            min="1"
            max="8"
          />
          <div class="number-input-buttons">
            <button 
              class="number-btn"
              type="button"
              onclick={() => {
                  if (numeroGiocatori < 8) numeroGiocatori += 1;
              }}
              aria-label="Increment"
            >
              <Icon icon="mdi:chevron-up" width="16" />
            </button>
            <button 
              class="number-btn"
              type="button" 
              onclick={() => {
                  if (numeroGiocatori > 1) numeroGiocatori -= 1;
              }}
              aria-label="Decrement"
            >
              <Icon icon="mdi:chevron-down" width="16" />
            </button>
          </div>
        </div>
      </div>
      
  
      {#if numeroGiocatori > 0}
        <div class="section">
          <h3 class="section-title">
            <Icon icon="mdi:sword" width="24" />
            Party Configuration
          </h3>
          {@render tabGiocatori()}
        </div>
      {:else}
        <div class="empty-state">
          <Icon icon="mdi:account-question" width="48" />
          <h3>Please enter the number of players</h3>
        </div>
      {/if}
  
      {#if expTotale.facile > 0}
        <div class="section">
          <h3 class="section-title">
            <Icon icon="mdi:treasure-chest" width="24" />
            Experience Thresholds
          </h3>
          {@render expCards()}
        </div>
        
        <div class="reset-section">
          <button onclick={resetPlayer} class="btn btn-primary reset-btn">
            <Icon icon="bx:reset" width="20" />
            Reset Players
          </button>
        </div>
      {:else}
        <div class="empty-state">
          <Icon icon="mdi:dice-d20" width="48" />
          <h3>Configure your party to see experience thresholds</h3>
          <p class="dark-grey">Add players and set their levels to calculate encounter difficulty</p>
        </div>
      {/if}
    </div>
  </div>
  
  <style>
    
    .container {
      padding: 1rem;
      max-width: 100%;
    }
  
    
    .section {
      margin-bottom: 2rem;
    }
  
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: var(--text-color);
      font-size: 1.25rem;
    }
  
    
    .player-input-section {
      margin-bottom: 2rem;
    }
  
    .input-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: var(--text-color);
    }
  
    .main-input {
      font-family: inherit;
      background: var(--input-bg-color);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem;
      color: var(--text-color);
      font-size: 1.1rem;
      text-align: center;
      width: 100px;
      transition: all 0.3s ease;
    }
  
    .main-input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
    }
  
 
    .players-table-wrapper {
      max-height: 400px;
      overflow-y: auto;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      background: var(--card-bg-color);
    }
  
    .players-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
  
    .players-table thead {
      position: sticky;
      top: 0;
      background: var(--table-header-bg);
      z-index: 2;
    }
  
    .players-table thead th {
      padding: 1rem;
      border-bottom: 2px solid var(--border-color);
      background: var(--table-header-bg);
      text-align: center;
      font-weight: 700;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  
    .players-table tbody tr {
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.2s ease;
    }
  
    .players-table tbody tr:hover {
      background-color: var(--table-row-hover);
    }
  
    .players-table tbody tr:last-child {
      border-bottom: none;
    }
  
    .players-table tbody td {
      padding: 1rem;
      text-align: center;
    }
  
    .player-number {
      font-weight: 600;
      color: var(--accent-color);
      font-size: 1.1rem;
    }
  
    
    .number-input-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      max-width: 140px;
      margin: 0 auto;
    }
  
    .player-level-input {
      font-family: inherit;
      background: var(--input-bg-color);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem;
      color: var(--text-color);
      width: 70px;
      text-align: center;
      font-weight: 600;
      transition: all 0.3s ease;
    }
  
    .player-level-input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
    }
  
    .number-input-buttons {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  
    .number-btn {
      width: 32px;
      height: 32px;
      background: var(--button-bg-color);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--button-text-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 14px;
    }
  
    .number-btn:hover {
      background: var(--button-hover-bg);
      border-color: var(--accent-color);
      transform: scale(1.05);
    }
  
    .number-btn:active {
      transform: scale(0.95);
    }
  
   
    .exp-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  
    .exp-card {
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
  
    .exp-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--card-color);
    }
  
    .exp-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--card-color);
    }
  
    .exp-card-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
  
    .exp-card-title {
      color: var(--card-color);
      font-weight: 700;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
  
    .exp-card-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--card-color);
      line-height: 1;
    }
  
   
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--secondary-text-color);
    }
  
    .empty-state h3 {
      margin: 1rem 0 0.5rem 0;
      color: var(--text-color);
    }
  
   
    .reset-section {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid var(--border-color);
    }
  
    .reset-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
  
    .reset-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
  
 
    .players-table-wrapper::-webkit-scrollbar {
      width: 8px;
    }
  
    .players-table-wrapper::-webkit-scrollbar-track {
      background: var(--input-bg-color);
      border-radius: 4px;
    }
  
    .players-table-wrapper::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 4px;
    }
  
    .players-table-wrapper::-webkit-scrollbar-thumb:hover {
      background: var(--accent-color);
    }
  
    
    @media (min-width: 480px) {
      .exp-cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .main-input {
        width: 120px;
      }
    }
  
    @media (min-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .exp-cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .exp-card-value {
        font-size: 2.25rem;
      }
      
      .section-title {
        font-size: 1.5rem;
      }
      
      .number-btn {
        width: 36px;
        height: 36px;
        font-size: 16px;
      }
      
      .player-level-input {
        width: 80px;
        padding: 0.75rem;
      }
      
    }
  
    @media (min-width: 1024px) {
  .exp-card {
    padding: 1.5rem;
  }
  
  .exp-card-value {
    font-size: 2rem;
  }
  
  .exp-card-title {
    font-size: 1.1rem;
  }
}
  
    @media (min-width: 1200px) {
      .container {
        padding: 3rem;
      }
      
      .exp-card-value {
        font-size: 3rem;
      }
    }
  
  
    @media (max-width: 320px) {
      .exp-cards-grid {
        gap: 0.75rem;
      }
      
      .exp-card {
        padding: 1rem;
      }
      
      .exp-card-value {
        font-size: 1.75rem;
      }
      
      .section-title {
        font-size: 1.1rem;
      }
      
      .number-input-container {
        max-width: 120px;
        gap: 0.5rem;
      }
      
      .player-level-input {
        width: 60px;
      }
      
      .number-btn {
        width: 28px;
        height: 28px;
      }
    }
  </style>