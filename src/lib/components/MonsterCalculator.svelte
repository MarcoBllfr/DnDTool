<script lang="ts">
  import { getCrExperience} from "$lib/data/LevelRules";
  import { loadMonsterData, saveMonsterData } from "$services/LocalStorage";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";


  function monsterMultiplier(monsterCount: number): number {
    if (monsterCount === 1) return 1;
    if (monsterCount === 2) return 1.5;
    if (monsterCount >= 3 && monsterCount <= 6) return 2;
    if (monsterCount >= 7 && monsterCount <= 10) return 2.5;
    if (monsterCount >= 11 && monsterCount <= 14) return 3;
    if (monsterCount >= 15) return 4;
    return 0;
  }

  let listaMonster = $state<Mostro[]>([]);
  let monsterGroup = $state(1);
  let totalExp = $state(0);
  let expSum = $state(0);
  let multiplierState = $state(0);

  function addMonster() {
    if (monsterGroup > listaMonster.length) {
      const nuovi = Array.from(
        { length: monsterGroup - listaMonster.length },
        () => ({ Cr: "1/8", quantity: 1 })
      );
      listaMonster.push(...nuovi);
    } else if (monsterGroup < listaMonster.length) {
      listaMonster.length = monsterGroup;
    }
  }

  onMount(() => {
    const saved = loadMonsterData();
  if (saved) {
    monsterGroup = saved.monsterGroup;
    listaMonster = saved.listaMonster;
    expSum = saved.expSum;
    multiplierState = saved.multiplierState;
    totalExp = saved.totalExp;
  }
    addMonster();
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
    totalExp = expSum * multiplierState ;
  }

  $effect(() => {
  expCalculation();
  addMonster();

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

  const crDisponibili: string[] = [
  "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", 
  "23", "24", "25", "26", "27", "28", "29", "30"
];
</script>


{#snippet tabMonster()}

    <table class="table">
      <thead>
        <tr>
          <th>Cr/Challenge Rating</th>
          <th>number</th>
        </tr>
      </thead>
      <tbody>
        {#each listaMonster as monster}
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
                <div class="table-number-input-container">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    bind:value={monster.quantity}
                    class="table-number-input"
                    placeholder="1"
                  />
                  <div class="table-number-input-buttons">
                    <button 
                      class="number-btn"
                      type="button"
                      onclick={() => {
                        if(monster.quantity < 99){
                          monster.quantity += 1;
                        }
                      }}
                      aria-label="Increment quantity"
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
                      aria-label="Decrement quantity"
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
 
{/snippet}

{#snippet monsterTabExp()}

    <table class="table">
      <thead>
        <tr>
          <th>Exp Sum</th>
          <th>motiplier</th>
          <th>Total Encounter Xp</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="important">{expSum}</td>
          <td class="important">{multiplierState}</td>
          <td class="important">{totalExp}</td>
        </tr>
      </tbody>
    </table>
  
{/snippet}

<div class="container">
    <div class="card card monster-card">
      <h1 class="text-center mb-m">Monster Calculator</h1>
      <div class="underscore mb-l"></div>
      
      <div class="mb-m">
        <label for="num" class="bold">
          <Icon icon="mdi:account-group" width="20" style="vertical-align: middle; margin-right: 8px;" />
          Group of Monsters:
        </label>
        <div class="number-input-container ml-2">
          <input
            id="num"
            type="number"
            bind:value={monsterGroup}
            class="w-full"
            placeholder="1"
          />
          <div class="number-input-buttons">
            <button 
              class="number-btn"
              type="button"
              onclick={() => {
                  monsterGroup += 1;
              }}
              aria-label="Increment"
            >
              <Icon icon="mdi:chevron-up" width="14" />
            </button>
            <button 
              class="number-btn"
              type="button" 
              onclick={() => {
                  monsterGroup -= 1;
              }}
              aria-label="Decrement"
            >
              <Icon icon="mdi:chevron-down" width="14" />
            </button>
          </div>
        </div>
      </div>
      
  
      {#if monsterGroup > 0}
        <div class="mb-m">
          <h3 class="mb-s">
            <Icon icon="mdi:sword" width="24" style="vertical-align: middle; margin-right: 8px;" />
            Group Configuration
          </h3>
          {@render tabMonster()}
        </div>
      {:else}
        <div class="card">
          <h3 class="text-center">Please enter a valid number of monsters</h3>
        </div>
      {/if}
  
      {#if totalExp > 0}
        <div class="mb-m">
          <h3 class="mb-s">
            <Icon icon="mdi:treasure-chest" width="24" style="vertical-align: middle; margin-right: 8px;" />
            Experience Thresholds
          </h3>
          {@render monsterTabExp()}
        </div>
        
        <div class="text-center mt-m">
          <button onclick={expCalculation} class="btn btn-primary">
            <Icon icon="mdi:calculator" width="20" style="vertical-align: middle; margin-right: 8px;" />
            Recalculate Experience
          </button>
        </div>
      {:else}
        <div class="card text-center">
          <Icon icon="mdi:dice-d20" width="48" style="color: #8b0000;" />
          <h3 class="mt-s">Configure your monster group to see experience thresholds</h3>
          <p class="dark-grey">Add monster and set their quantity to calculate encounter difficulty</p>
        </div>
      {/if}
    </div>
  </div>
  
<style>
  .cr-select {
    font-family: inherit;
    background: var(--input-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    color: var(--text-color);
    padding-right: 2rem;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    min-width: 100px;
    width: 100%;
  }


  .table-number-input-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 120px;
    margin: 0 auto;
  }

  .table-number-input {
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

  .table-number-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
  }

 

  .table-number-input-buttons {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .table-number-input-buttons .number-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  @media (min-width: 768px) {
    .table-number-input-container {
      max-width: 140px;
      gap: 10px;
    }
    
    .table-number-input {
      width: 70px;
    }
    
    .table-number-input-buttons .number-btn {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
  }
</style>