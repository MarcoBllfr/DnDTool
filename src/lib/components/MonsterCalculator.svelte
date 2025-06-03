<script lang="ts">
  import { getCrExperience, levelRules } from "$lib/data/LevelRules";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  interface Mostro {
    Cr: string;
    quantity: number;
  }

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
    addMonster() ;
  });

  const crDisponibili: string[] = [
  "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", 
  "23", "24", "25", "26", "27", "28", "29", "30"
];
</script>


{#snippet tabMonster()}
  <div class="table-card">
    <table class="table">
      <thead>
        <tr>
          <th>Cr/Challenge Rating</th>
          <th>quantity</th>
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
                <div class="number-input-container">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    bind:value={monster.quantity}
                    class="w-full"
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
  </div>
{/snippet}

{#snippet monsterTabExp()}
<div class="table-card">
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
  </div>
{/snippet}

<div class="container">
    <div class="card">
      <h1 class="text-center mb-m">D&D Monster Calculator</h1>
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
            Party Configuration
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
    .w-full {
      width: 30%;
    }
  </style>