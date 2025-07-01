<script lang="ts">
  import { getCrExperience} from "$lib/data/LevelRules";
  import { loadMonsterData, resetMonsterData, saveMonsterData } from "$services/LocalStorage";
  import Icon from "@iconify/svelte";
  import { browser } from '$app/environment';

  function monsterMultiplier(monsterCount: number): number {
    if (monsterCount === 1) return 1;
    if (monsterCount === 2) return 1.5;
    if (monsterCount >= 3 && monsterCount <= 6) return 2;
    if (monsterCount >= 7 && monsterCount <= 10) return 2.5;
    if (monsterCount >= 11 && monsterCount <= 14) return 3;
    if (monsterCount >= 15) return 4;
    return 0;
  }

  let { 
    totalExp = $bindable(0),
    expSum = $bindable(0), 
    multiplierState = $bindable(0),
    monsterQuantity = $bindable(0)
  } = $props();

  let listaMonster = $state<Mostro[]>([]);
  let monsterGroup = $state(1);

  const crDisponibili: string[] = [
    "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", 
    "23", "24", "25", "26", "27", "28", "29", "30"
  ];

  // Config moltipicatori
  interface multiplierConfigProps {
    label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  }
  const multiplierConfig: Record<string, multiplierConfigProps>  = {
    1: { 
      label: 'Single', 
      icon: 'mdi:numeric-1-circle', 
      color: '#10b981', 
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    1.5: { 
      label: 'Pair', 
      icon: 'mdi:numeric-2-circle', 
      color: '#f59e0b', 
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    2: { 
      label: 'Group', 
      icon: 'mdi:account-group', 
      color: '#ef4444', 
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    2.5: { 
      label: 'Pack', 
      icon: 'mdi:account-multiple', 
      color: '#8b5cf6', 
      bgColor: 'rgba(139, 92, 246, 0.1)',
      borderColor: 'rgba(139, 92, 246, 0.3)'
    },
    3: { 
      label: 'Horde', 
      icon: 'mdi:crowd', 
      color: '#dc2626', 
      bgColor: 'rgba(220, 38, 38, 0.1)',
      borderColor: 'rgba(220, 38, 38, 0.3)'
    },
    4: { 
      label: 'Army', 
      icon: 'mdi:sword-cross', 
      color: '#7c2d12', 
      bgColor: 'rgba(124, 45, 18, 0.1)',
      borderColor: 'rgba(124, 45, 18, 0.3)'
    }
  };

  // Usa $effect per aggiornare listaMonster al cambiamento di monsterGroup
  $effect(() => {
    if (monsterGroup > listaMonster.length) {
      const nuovi = Array.from({ length: monsterGroup - listaMonster.length }, () => ({ Cr: "1/8", quantity: 1 }));
      listaMonster.push(...nuovi);
    } else if (monsterGroup < listaMonster.length) {
      listaMonster.length = monsterGroup;
    }
  });

  function expCalculation() {
    let tempExp = 0;
    let totalMonster = 0;
    listaMonster.forEach((monster) => {
      tempExp += getCrExperience(monster.Cr) * monster.quantity;
      totalMonster += monster.quantity;
    });
    expSum = tempExp;
    multiplierState = monsterMultiplier(totalMonster);
    totalExp = expSum * multiplierState;
    monsterQuantity = totalMonster;
  }

  $effect(() => {
    if (listaMonster.length > 0) {
      expCalculation();
    }
  });

  $effect(() => {
    if (listaMonster.length > 0) {
      saveMonsterData({
        monsterGroup,
        listaMonster,
        expSum,
        multiplierState,
        totalExp,
        lastSaved: new Date().toISOString()
      });
    }
  });

  if (browser) {
    const saved = loadMonsterData();
    if (saved) {
      monsterGroup = saved.monsterGroup;
      listaMonster = saved.listaMonster;
      expSum = saved.expSum;
      multiplierState = saved.multiplierState;
      totalExp = saved.totalExp;
    }
  }

  function resetMonsters() {
    const data = resetMonsterData();
    monsterGroup = data.monsterGroup;
    listaMonster = data.listaMonster;
    expSum = data.expSum;
    multiplierState = data.multiplierState;
    totalExp = data.totalExp;
  }
</script>

{#snippet tabMonster()}
  <div class="monsters-table-wrapper">
    <table class="monsters-table">
      <thead>
        <tr>
          <th>Challenge Rating</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {#each listaMonster as monster, index}
        <tr>
          <td>
            <select
              bind:value={monster.Cr}
              class="cr-select"
              aria-label="Challenge Rating"
            >
              {#each crDisponibili as cr}
                <option value={cr}>CR {cr}</option>
              {/each}
            </select>
          </td>
          <td>
            <div class="number-input-container">
              <input
                type="number"
                min="1"
                max="99"
                bind:value={monster.quantity}
                class="monster-quantity-input"
                placeholder="1"
              />
              <div class="number-input-buttons">
                <button 
                  class="number-btn"
                  type="button"
                  onclick={() => {
                    if(monster.quantity < 99){
                      monster.quantity += 1;
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
                    if(monster.quantity > 1){
                      monster.quantity -= 1;
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
    <div 
      class="exp-card" 
      style="
        --card-color: #10b981;
        --card-bg: rgba(16, 185, 129, 0.1);
        --card-border: rgba(16, 185, 129, 0.3);
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon="mdi:calculator" 
          width="24" 
          style="color: #10b981;" 
        />
        <h4 class="exp-card-title">Base XP</h4>
      </div>
      <div class="exp-card-value">
        {expSum}
      </div>
    </div>

    <div 
      class="exp-card" 
      style="
        --card-color: {multiplierConfig[multiplierState]?.color || '#6b7280'};
        --card-bg: {multiplierConfig[multiplierState]?.bgColor || 'rgba(107, 114, 128, 0.1)'};
        --card-border: {multiplierConfig[multiplierState]?.borderColor || 'rgba(107, 114, 128, 0.3)'};
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon={multiplierConfig[multiplierState]?.icon || 'mdi:multiplication'} 
          width="24" 
          style="color: {multiplierConfig[multiplierState]?.color || '#6b7280'};" 
        />
        <h4 class="exp-card-title">{multiplierConfig[multiplierState]?.label || 'Multiplier'}</h4>
      </div>
      <div class="exp-card-value">
        x{multiplierState}
      </div>
    </div>

    <div 
      class="exp-card total-exp-card" 
      style="
        --card-color: #dc2626;
        --card-bg: rgba(220, 38, 38, 0.1);
        --card-border: rgba(220, 38, 38, 0.3);
      "
    >
      <div class="exp-card-header">
        <Icon 
          icon="mdi:treasure-chest" 
          width="24" 
          style="color: #dc2626;" 
        />
        <h4 class="exp-card-title">Total XP</h4>
      </div>
      <div class="exp-card-value">
        {totalExp}
      </div>
    </div>
  </div>
{/snippet}

<div class="container">
  <div class="card card monster-card">
    <h1 class="text-center mb-m">Monster Calculator</h1>
    <div class="underscore mb-l"></div>
    
    <div class="monster-input-section">
      <label for="num" class="input-label">
        <Icon icon="mdi:sword" width="20" />
        Number of Monster Groups:
      </label>
      <div class="number-input-container">
        <input
          id="num"
          type="number"
          bind:value={monsterGroup}
          class="main-input"
          placeholder="1"
          min="1"
          max="10"
        />
        <div class="number-input-buttons">
          <button 
            class="number-btn"
            type="button"
            onclick={() => {
                if (monsterGroup < 10) monsterGroup += 1;
            }}
            aria-label="Increment"
          >
            <Icon icon="mdi:chevron-up" width="16" />
          </button>
          <button 
            class="number-btn"
            type="button" 
            onclick={() => {
                if (monsterGroup > 1) monsterGroup -= 1;
            }}
            aria-label="Decrement"
          >
            <Icon icon="mdi:chevron-down" width="16" />
          </button>
        </div>
      </div>
    </div>
    

    {#if monsterGroup > 0}
      <div class="section">
        <h3 class="section-title">
          <Icon icon="mdi:dragon" width="24" />
          Monster Configuration
        </h3>
        {@render tabMonster()}
      </div>
    {:else}
      <div class="empty-state">
        <Icon icon="mdi:help-circle" width="48" />
        <h3>Please enter the number of monster groups</h3>
      </div>
    {/if}

    {#if totalExp > 0}
      <div class="section">
        <h3 class="section-title">
          <Icon icon="mdi:calculator-variant" width="24" />
          Experience Calculation
        </h3>
        {@render expCards()}
      </div>
      
      <div class="reset-section">
        <button onclick={resetMonsters} class="btn btn-primary reset-btn">
          <Icon icon="bx:reset" width="20" />
          Reset Monsters
        </button>
      </div>
    {:else}
      <div class="empty-state">
        <Icon icon="mdi:dice-d20" width="48" />
        <h3>Configure your monsters to see experience calculation</h3>
        <p class="dark-grey">Add monster groups and set their CR to calculate encounter XP</p>
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

  
  .monster-input-section {
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

 
  .monsters-table-wrapper {
    max-height: 400px;
    overflow-y: auto;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    background: var(--card-bg-color);
  }

  .monsters-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  .monsters-table thead {
    position: sticky;
    top: 0;
    background: var(--table-header-bg);
    z-index: 2;
  }

  .monsters-table thead th {
    padding: 1rem;
    border-bottom: 2px solid var(--border-color);
    background: var(--table-header-bg);
    text-align: center;
    font-weight: 700;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .monsters-table tbody tr {
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
  }

  .monsters-table tbody tr:hover {
    background-color: var(--table-row-hover);
  }

  .monsters-table tbody tr:last-child {
    border-bottom: none;
  }

  .monsters-table tbody td {
    padding: 1rem;
    text-align: center;
  }

  
  .cr-select {
    font-family: inherit;
    background: var(--input-bg-color);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 120px;
    margin: 0 auto;
    display: block;
  }

  .cr-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
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

  .monster-quantity-input {
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

  .monster-quantity-input:focus {
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

  .total-exp-card {
    grid-column: 1 / -1;
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

 
  .monsters-table-wrapper::-webkit-scrollbar {
    width: 8px;
  }

  .monsters-table-wrapper::-webkit-scrollbar-track {
    background: var(--input-bg-color);
    border-radius: 4px;
  }

  .monsters-table-wrapper::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }

  .monsters-table-wrapper::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
  }

  
  @media (min-width: 480px) {
    .exp-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .total-exp-card {
      grid-column: 1 / -1;
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
    
    .monster-quantity-input {
      width: 80px;
      padding: 0.75rem;
    }
    
    .cr-select {
      max-width: 140px;
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
    
   
    .exp-cards-grid {
      grid-template-columns: repeat(2, 2fr);
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
    
    .monster-quantity-input {
      width: 60px;
    }
    
    .number-btn {
      width: 28px;
      height: 28px;
    }
    
    .cr-select {
      max-width: 100px;
      padding: 0.5rem;
    }
  }
</style>